import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { getKeys } from "./getKeys";
import { type captionId, type videoId } from "./youtube";

export type captionStatus = Date | boolean | undefined;

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const useShowCaps = create(
  persist(() => ({} as Record<captionId, captionStatus>),
    {
      name: "youtube multi storage",
      partialize: (s) => {
        const previousDay = addDays(new Date(), -1);
        return Object.fromEntries(Object.entries(s).map(([key, value]) =>
          value === false ? [key, undefined] :
            value === true ? [key, new Date()] :
              [key, new Date(value) > previousDay ? new Date(value) : undefined]));
      },
    }
  )
);

export function setShowCap(captionId: captionId, show: captionStatus) {
  useShowCaps.setState({ [captionId]: show });
}

export const usePots = create<Record<videoId, string>>(() => ({}));

export const useTracks = create<Record<captionId, TextTrack>>(() => ({}));

export function addTrackToCache(captionId: captionId, track: TextTrack) {
  useTracks.setState({ [captionId]: track });
}

export const useSrt = create<Record<captionId, string>>(() => ({}));
export const useSrtKeys = () => useSrt(useShallow(getKeys));
export const useSrtKeysCount = () => useSrt(s => getKeys(s).length);

export function addSrtCaption(captionId: captionId, fileName: string) {
  useSrt.setState({ [captionId]: fileName });
}

export function clearSrtCaptions() {
  useSrt.setState({}, true);
}
