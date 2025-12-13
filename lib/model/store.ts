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

// export const useShowCaps = create(
//   persist(
//     () => ({
//       showCap: {} as Record<captionId, captionStatus>,
//     }),
//     {
//       name: "youtube multi storage",
//       partialize: ({ showCap }) => {
//         const previousDay = addDays(new Date(), -1);
//         return {
//           showCap: Object.fromEntries(
//             Object.entries(showCap).map(([key, value]) =>
//               value === false ? [key, undefined] :
//                 value === true ? [key, new Date()] :
//                   [key, new Date(value) > previousDay ? new Date(value) : undefined]
//             )
//           ),
//         };
//       },
//     }
//   )
// );

export function setShowCap(captionId: captionId, show: captionStatus) {
  getDefaultStore().set(getShowCapFam(captionId), show);
}

function getFam<D>(fam: AtomFamily<string, D>) {
  return (captionId: captionId) => fam([getVideoId(), captionId].join(','))
}

function useKeysFam<D>(fam: AtomFamily<string, D>) {
  return () => useAllMyFam(fam).map(c => c.split(',')[1]);
}

const showCapFam = atomFamily((videoIdPluscaptionId: captionId) => atom(false as captionStatus));
export const getShowCapFam = getFam(showCapFam);
export const useShowCapKeys = useKeysFam(showCapFam);

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

const srtFam = atomFamily((videoIdPluscaptionId: captionId) => atom(''));
export const srtGetFam = getFam(srtFam);
export const useSrtFam = useKeysFam(srtFam);

export function addSrtCaption(captionId: captionId, fileName: string) {
  getDefaultStore().set(srtGetFam(captionId), fileName);
}
