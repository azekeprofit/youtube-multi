import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type captionId } from "./youtube";

export type captionStatus = boolean | undefined;

export const useShowCaps = create(
  persist(
    () => ({
      showCap: {} as Record<captionId, captionStatus>,
    }),
    {
      name: "youtube multi storage",
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
