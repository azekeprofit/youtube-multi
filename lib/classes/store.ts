import { create } from "zustand";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";
import { loadYoutubeCaptions } from "./subtitle";
import { getCaptionId, type captionId, type ytCaptionTrack } from "./youtube";

export const ccButtonSelector = ".ytp-subtitles-button.ytp-button";
const aButton = document.querySelector<HTMLElement>(`a${ccButtonSelector}`);
type status = boolean | undefined;

interface youtubeMultiStorage {
  showCap: Map<captionId, status>;
}

interface youtubeMultiStore extends youtubeMultiStorage {
  tracks: Map<captionId, TextTrack>;
}

const storage: PersistStorage<youtubeMultiStorage> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    const {
      state: { showCap },
    } = JSON.parse(str);
    return {
      state: {
        showCap: new Map<captionId, status>(showCap),
      },
    };
  },
  setItem: (name, newValue: StorageValue<youtubeMultiStore>) => {
    const str = JSON.stringify({
      state: { showCap: Array.from(newValue.state.showCap.entries()) },
    });
    localStorage.setItem(name, str);
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useStore = create(
  persist(
    () => ({
      showCap: new Map<captionId, status>(),
      tracks: new Map<captionId, TextTrack>(),
    }),
    {
      name: "youtube multi storage",
      partialize: ({ showCap }) => ({ showCap }),
      storage,
    }
  )
);

export function setShowCap(captionId: captionId, show: status) {
  useStore.setState((prev) => ({
    showCap: new Map(prev.showCap).set(captionId, show),
  }));
  const track = useStore.getState().tracks.get(captionId);
  if (track) track.mode = show ? "showing" : "hidden";
}

async function createTrack(caption: ytCaptionTrack) {
  const { languageCode, baseUrl } = caption;
  const response = await fetch(baseUrl);
  const text = await response.text();
  const track = loadYoutubeCaptions(languageCode, text);
  track.mode = useStore.getState().showCap.get(getCaptionId(caption))
    ? "showing"
    : "hidden";
  return track;
}

export function loadTrack(caption: ytCaptionTrack) {
  const captionId = getCaptionId(caption);
  return useStore.getState().tracks.get(captionId)
    ? Promise.resolve()
    : createTrack(caption).then((track) =>
        useStore.setState((prev) => ({
          tracks: new Map(prev.tracks).set(captionId, track),
        }))
      );
}
