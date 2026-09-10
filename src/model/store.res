let update = (store: Signal.t<Dict.t<'t>>, key: string, value: 't) => {
  let newDict = store.value->Dict.copy
  newDict->Dict.set(key, value)
  store.value = newDict
}

let trackContainer = Signal.make(dict{})

let addTrackToCache = (Captions.CaptionId(captionId), track: WebAPI.WebVTTTypes.textTrack) =>
  trackContainer->update(captionId, track)

@unboxed type captionStatus = Date(Date.t) | Boolean(bool) | None

@new external copyDate:Date.t=>Date.t="Date"

let addDays=(date: Date.t, days: int)=> {
   let result = date->copyDate
   result->Date.setDate(result->Date.getDate + days)
   result;
 }

// type showCapsType = Record<captionId, captionStatus>;

// interface storage {
//   state: showCapsType
// }
// const storageId = 'youtube multi storage';
// function getStorageShowCaps() {
//   return (JSON.parse(localStorage.getItem(storageId)) as storage)?.state ?? {};
// }

// export const showCaps = signal<showCapsType>(getStorageShowCaps());

// function setStorage(captionId: captionId, showCap: captionStatus) {
//   const previousDay = addDays(new Date(), -1);
//   const storage = getStorageShowCaps();
//   const newStorage: storage = {
//     state: Object.fromEntries(
//       [...Object.entries(storage).map(([key, value]) =>
//         value === false ? [key, undefined] :
//           value === true ? [key, new Date()] :
//             [key, new Date(value) > previousDay ? new Date(value) : undefined]
//       ), [captionId, showCap]]
//     )
//   };
//   localStorage.setItem(storageId, JSON.stringify(newStorage));
// }

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
