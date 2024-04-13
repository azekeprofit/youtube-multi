import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type captionId } from "./youtube";

export type captionStatus = Date | boolean | undefined;

function addDays(date, days) {
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
                value instanceof Date ? [key, value > previousDay ? value : undefined] :
                [key, value]
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
