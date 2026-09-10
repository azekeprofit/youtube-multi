let update = (store: Signal.t<Dict.t<'t>>, key: string, value: 't) => {
  let newDict = store.value->Dict.copy
  newDict->Dict.set(key, value)
  store.value = newDict
}

let trackContainer = Signal.make(dict{})

let addTrackToCache = (Captions.CaptionId(captionId), track: WebAPI.WebVTTTypes.textTrack) =>
  trackContainer->update(captionId, track)

@unboxed type captionStatus = Date(string) | Boolean(bool) | None

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

let saveStorage = (captionId: Captions.captionId, showCap: captionStatus) => {
  let previousDay = Date.make()
  previousDay->Date.setDate(Date.getDate(previousDay) - 1)
  let newState = getStorageShowCaps()->Dict.mapValues(value =>
    switch value {
    | Boolean(b) => b ? Date(Date.make()->Date.toString) : None
    | Date(dateString) => Date.fromString(dateString) > previousDay ? Date(dateString) : None
    | _ => None
    }
  )
  newState->Dict.set(captionId->Captions.captionIdToString, showCap)
  window.localStorage->WebAPI.Storage.setItem(
    ~key=storageId,
    ~value=stringifyStorage({state: newState}),
  )
}

// export function setShowCap(captionId: captionId, show: captionStatus) {
//   if (showCaps.value[captionId] !== show) {
//     showCaps.value = { ...showCaps.value, [captionId]: show };
//     setStorage(captionId, show);
//   }
// }

let pots = Signal.make(dict{})
type potEvent = PotEvent({videoId: Captions.videoId, pot: string})
let addPot = (PotEvent({videoId: Captions.VideoId(v), pot})) => {
  if !(pots.value->Dict.has(v)) {
    pots->update(v, pot)
  }
}

let srtContainer = Signal.make(dict{})
let srtKeys = Signal.computed(() => srtContainer.value->Dict.keysToArray)
let addSrtCaption = (Captions.CaptionId(captionId), fileName: string) =>
  srtContainer->update(captionId, fileName)
