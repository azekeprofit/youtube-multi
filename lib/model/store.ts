import { getKeys } from "./getKeys";
import { type captionId, type videoId } from "./youtube";
import { createMemo, createSignal } from "solid-js";

export type captionStatus = Date | boolean | undefined;

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

type showCapsType = Record<captionId, captionStatus>;

interface storage {
  state: showCapsType
}
const storageId = 'youtube multi storage';
function getStorageShowCaps() {
  return (JSON.parse(localStorage.getItem(storageId)) as storage)?.state ?? {};
}

export const [showCaps,setShowCap0] = createSignal<showCapsType>(getStorageShowCaps());

function setStorage(captionId: captionId, showCap: captionStatus) {
  const previousDay = addDays(new Date(), -1);
  const storage = getStorageShowCaps();
  const newStorage: storage = {
    state: Object.fromEntries(
      [...Object.entries(storage).map(([key, value]) =>
        value === false ? [key, undefined] :
          value === true ? [key, new Date()] :
            [key, new Date(value) > previousDay ? new Date(value) : undefined]
      ), [captionId, showCap]]
    )
  };
  localStorage.setItem(storageId, JSON.stringify(newStorage));
}

export function setShowCap(captionId: captionId, show: captionStatus) {
  if (showCaps()[captionId] !== show) {
    setShowCap0({ ...showCaps(), [captionId]: show });
    setStorage(captionId, show);
  }
}

export const [pots, setPots] = createSignal<Record<videoId, string>>({});
export type potEvent = { videoId: videoId, pot: string }
export function addPot({ videoId, pot }: potEvent) {
  if (!pots()[videoId])
    setPots({ ...pots(), [videoId]: pot });
}

export const [trackContainer, setTrackContainer] = createSignal<Record<captionId, TextTrack>>({});

export function addTrackToCache(captionId: captionId, track: TextTrack) {
  setTrackContainer({ ...trackContainer(), [captionId]: track });
}

export const [srtContainer, setSrt] = createSignal<Record<captionId, string>>({});
export const srtKeys = createMemo(() => getKeys(srtContainer()));
export function addSrtCaption(captionId: captionId, fileName: string) {
  setSrt({ ...srtContainer(), [captionId]: fileName });
}
