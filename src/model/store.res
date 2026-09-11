let update = (store: Signal.t<Dict.t<'t>>, key: string, value: 't) => {
  let newDict = store.value->Dict.copy
  newDict->Dict.set(key, value)
  store.value = newDict
}

let trackContainer = Signal.make(dict{})

let addTrackToCache = (Types.CaptionId(captionId), track: WebAPI.WebVTTTypes.textTrack) =>
  trackContainer->update(captionId, track)
external asMediaElement: WebAPI.DOMTypes.element => WebAPI.DOMTypes.htmlVideoElement = "%identity"
let addTrack = (
  videoTag: WebAPI.DOMTypes.element,
  captionId: Types.captionId,
  vssId: Types.vssId,
) => {
  let player = videoTag->asMediaElement
  let track =
    player->WebAPI.HTMLVideoElement.addTextTrack(~kind=Captions, ~label=vssId, ~language=vssId)
  addTrackToCache(captionId, track)
  track
}

@unboxed type captionStatus = Date(string) | Boolean(bool) | @as(null) None

type storage = {state?: Dict.t<captionStatus>}
let storageId = "youtube multi storage"
external parseStorage: string => storage = "JSON.parse"
external stringifyStorage: storage => string = "JSON.stringify"
let getStorageShowCaps = () =>
  switch window.localStorage->WebAPI.Storage.getItem(storageId) {
  | Value(i) =>
    switch (i->parseStorage).state {
    | Some(s) => s
    | None => dict{}
    }
  | Null => dict{}
  }

let showCaps = Signal.make(getStorageShowCaps())

let saveStorage = (Types.CaptionId(captionId), showCap: captionStatus) => {
  let previousDay = Date.make()
  previousDay->Date.setDate(Date.getDate(previousDay) - 1)
  let newState = getStorageShowCaps()->Dict.mapValues(value =>
    switch value {
    | Boolean(b) => b ? Date(Date.make()->Date.toString) : None
    | Date(dateString) => Date.fromString(dateString) > previousDay ? Date(dateString) : None
    | _ => None
    }
  )
  newState->Dict.set(captionId, showCap)
  window.localStorage->WebAPI.Storage.setItem(
    ~key=storageId,
    ~value=stringifyStorage({state: newState}),
  )
}

let setShowCap = (captionId: Types.captionId, show: captionStatus) => {
  let Types.CaptionId(key) = captionId
  if showCaps.value->Dict.get(key) !== Some(show) {
    showCaps->update(key, show)
    saveStorage(captionId, show)
  }
}

let srtContainer = Signal.make(dict{})
let srtKeys = Signal.computed(() => srtContainer.value->Dict.keysToArray)
let addSrtCaption = (Types.CaptionId(captionId), fileName: string) =>
  srtContainer->update(captionId, fileName)
