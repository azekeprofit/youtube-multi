import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type captionId, type videoId } from "./youtube";

export type captionStatus = Date | boolean | undefined;

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const useShowCaps = create(
  persist(
    () => ({
      showCap: {} as Record<captionId, captionStatus>,
    }),
    {
      name: "youtube multi storage",
      partialize: ({ showCap }) => {
        const previousDay = addDays(new Date(), -1);
        return {
          showCap: Object.fromEntries(
            Object.entries(showCap).map(([key, value]) =>
              value === false ? [key, undefined] :
                value === true ? [key, new Date()] :
                  [key, new Date(value) > previousDay ? new Date(value) : undefined]
            )
          ),
        };
      },
    }
  )
);

export function setShowCap(captionId: captionId, show: captionStatus) {
  useShowCaps.setState((prev) => ({
    showCap: { ...prev.showCap, [captionId]: show },
  }));
}


export const usePots = create(() => ({
  pots: {} as Record<videoId, string>,
}));

export const useTracks = create(() => ({
  cache: {} as Record<captionId, TextTrack>,
}));

export function addTrackToCache(captionId: captionId, track: TextTrack) {
  useTracks.setState({
    cache: { ...useTracks.getState().cache, [captionId]: track },
  });
}

export const useSrt = create(() => ({
  srtCaptions: {} as Record<captionId, string>,
}));

export function addSrtCaption(captionId: captionId, fileName: string) {
  useSrt.setState({
    srtCaptions: {
      ...useSrt.getState().srtCaptions,
      [captionId]: fileName,
    },
  });
}

export function clearSrtCaptions() {
  useSrt.setState({ srtCaptions: {} });
}
