import { atom, getDefaultStore } from "jotai";
import { atomFamily, type AtomFamily } from "jotai-family";
import { useEffect } from "preact/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { forceUpdate } from "../hooks/forceUpdate";
import { getVideoId, type captionId, type videoId } from "./youtube";

export type captionStatus = Date | boolean | undefined;

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

interface storage {
  state: {
    showCap: Record<captionId, captionStatus>
  }
}
const storageId = 'youtube multi storage';
function getStorageShowCaps() {
  return (JSON.parse(localStorage.getItem(storageId)) as storage)?.state?.showCap??{};
}

function setStorage(captionId: captionId, showCap: captionStatus) {
  const previousDay = addDays(new Date(), -1);
  const storage = getStorageShowCaps();
  const newStorage: storage = {
    state: {
      showCap: Object.fromEntries(
        [...Object.entries(storage).map(([key, value]) =>
          value === false ? [key, undefined] :
            value === true ? [key, new Date()] :
              [key, new Date(value) > previousDay ? new Date(value) : undefined]
        ), [captionId, showCap]]
      )
    }
  };
  localStorage.setItem(storageId, JSON.stringify(newStorage));
}

export function setShowCap(captionId: captionId, show: captionStatus) {
  getDefaultStore().set(showCapFam(captionId), show);
  setStorage(captionId, show);
}

export const showCapFam = atomFamily((captionId: captionId) => atom(getStorageShowCaps()?.[captionId] ?? false));

export const potFam = atomFamily((id: videoId) => atom(''));

export const trackFam = atomFamily((captionId: captionId) => atom(null as TextTrack));

export function addTrackToCache(captionId: captionId, track: TextTrack) {
  getDefaultStore().set(trackFam(captionId), track);
}

export function useAllMyFam<P, A>(fam: AtomFamily<P, A>) {
  const update = forceUpdate();
  useEffect(() => fam.unstable_listen(update), [])
  return [...fam.getParams()];
}

export const srtFam = atomFamily((captionId: captionId) => atom(''));

export function addSrtCaption(captionId: captionId, fileName: string) {
  getDefaultStore().set(srtFam(captionId), fileName);
}


export function clearSrtCaptions() {
  for (const s of srtFam.getParams()) srtFam.remove(s);
}
