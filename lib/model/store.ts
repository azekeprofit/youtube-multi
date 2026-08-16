import { signal } from "@preact/signals";
import { type captionId, type videoId } from "./youtube";

export type captionStatus = Date | boolean | undefined;

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// export const useShowCaps = create(
//   persist(() => ({} as Record<captionId, captionStatus>),
//     {
//       name: "youtube multi storage",
//       partialize: (s) => {
//         const previousDay = addDays(new Date(), -1);
//         return Object.fromEntries(Object.entries(s).map(([key, value]) =>
//           value === false ? [key, undefined] :
//             value === true ? [key, new Date()] :
//               [key, new Date(value) > previousDay ? new Date(value) : undefined]));
//       },
//     }
//   )
// );

export const showCaps = signal({} as Record<captionId, captionStatus>);

export function setShowCap(captionId: captionId, show: captionStatus) {
  if (showCaps.value[captionId] !== show)
    showCaps.value = { ...showCaps.value, [captionId]: show };
}

export const pots = signal({} as Record<videoId, string>);

export const trackContainer = signal({} as Record<captionId, TextTrack>);

export function addTrackToCache(captionId: captionId, track: TextTrack) {
  trackContainer.value = { ...trackContainer.value, [captionId]: track };
}

export const srtContainer = signal({} as Record<captionId, string>);

export function addSrtCaption(captionId: captionId, fileName: string) {
  srtContainer.value = { ...srtContainer.value, [captionId]: fileName };
}
