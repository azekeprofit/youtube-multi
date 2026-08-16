import { signal } from "@preact/signals";
import { type captionId, type videoId } from "./youtube";

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

export const showCaps = signal<showCapsType>(getStorageShowCaps());

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
  if (showCaps.value[captionId] !== show) {
    showCaps.value = { ...showCaps.value, [captionId]: show };
    setStorage(captionId, show);
  }
}

export const pots = signal<Record<videoId, string>>({});
export type potEvent = { videoId: videoId, pot: string }
export function addPot({ videoId, pot }: potEvent) {
  if (!pots.value[videoId]) pots.value = { ...pots.value, [videoId]: pot };
}

export const trackContainer = signal<Record<captionId, TextTrack>>({});

export function addTrackToCache(captionId: captionId, track: TextTrack) {
  trackContainer.value = { ...trackContainer.value, [captionId]: track };
}

export const srtContainer = signal<Record<captionId, string>>({});

export function addSrtCaption(captionId: captionId, fileName: string) {
  srtContainer.value = { ...srtContainer.value, [captionId]: fileName };
}
