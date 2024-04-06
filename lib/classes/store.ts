import { create } from "zustand";
import { getVideoId, getCaptions, type ytCaptionTrack } from "./youtube";
import { loadYoutubeCaptions } from "./subtitle";

export const ccButtonSelector = ".ytp-subtitles-button.ytp-button";
const aButton = document.querySelector<HTMLElement>(`a${ccButtonSelector}`);
type status = boolean | undefined;

export const useStore = create(() => ({
  button: new Map<string, status>(),
  tracks: new Map<string, TextTrack>(),
  showCap: new Map<string, status>(),
}));

export function setButton(newStatus: status) {
  useStore.setState((prev) => ({
    button: new Map(prev.button).set(getVideoId(), newStatus),
  }));
  aButton.setAttribute("aria-pressed", newStatus ? "true" : "false");
}

export function setShowCap(captionUrl: string, show: status) {
  useStore.setState((prev) => ({
    showCap: new Map(prev.showCap).set(captionUrl, show),
  }));

  const track = useStore.getState().tracks.get(captionUrl);
  if (track) track.mode = show ? "showing" : "hidden";
}

async function createTrack({ languageCode, baseUrl }: ytCaptionTrack) {
  const response = await fetch(baseUrl);
  const text = await response.text();
  return loadYoutubeCaptions(languageCode, text);
}

export function loadTrack(caption: ytCaptionTrack) {
  const { baseUrl } = caption;
  if (!useStore.getState().tracks.get(baseUrl))
    createTrack(caption).then((track) =>
      useStore.setState((prev) => ({
        tracks: new Map(prev.tracks).set(baseUrl, track),
      }))
    );
}
