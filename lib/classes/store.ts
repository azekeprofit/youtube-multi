import { create } from "zustand";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";
import {
  getVideoId,
  getCaptions,
  type ytCaptionTrack,
  type captionId,
  type videoId,
  getCaptionId,
} from "./youtube";
import { loadYoutubeCaptions } from "./subtitle";

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

export function setShowCap(caption: ytCaptionTrack, show: status) {
  const captionId = getCaptionId(caption);
  useStore.setState((prev) => ({
    showCap: new Map(prev.showCap).set(captionId, show),
  }));
  const track = useStore.getState().tracks.get(captionId);
  if (track) track.mode = show ? "showing" : "hidden";
}

async function createTrack({ languageCode, baseUrl }: ytCaptionTrack) {
  const response = await fetch(baseUrl);
  const text = await response.text();
  return loadYoutubeCaptions(languageCode, text);
}

export function loadTrack(caption: ytCaptionTrack) {
  const captionId = getCaptionId(caption);
  if (!useStore.getState().tracks.get(captionId))
    return createTrack(caption).then((track) =>
      useStore.setState((prev) => ({
        tracks: new Map(prev.tracks).set(captionId, track),
      }))
    );
  return Promise.resolve();
}
