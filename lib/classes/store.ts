import { create } from "zustand";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";
import { getVideoId, getCaptions, type ytCaptionTrack } from "./youtube";
import { loadYoutubeCaptions } from "./subtitle";

export const ccButtonSelector = ".ytp-subtitles-button.ytp-button";
const aButton = document.querySelector<HTMLElement>(`a${ccButtonSelector}`);
type status = boolean | undefined;

interface youtubeMultiStorage {
  showCap: Map<string, status>;
}

interface youtubeMultiStore extends youtubeMultiStorage {
  button: Map<string, status>;
  tracks: Map<string, TextTrack>;
}

const storage: PersistStorage<youtubeMultiStorage> = {
  getItem: (name) => {
    const str = sessionStorage.getItem(name);
    if (!str) return null;
    const showCap = JSON.parse(str);
    return {
      state: {
        showCap: new Map<string, status>(showCap),
      },
    };
  },
  setItem: (name, newValue: StorageValue<youtubeMultiStore>) => {
    const str = JSON.stringify({
      state: { showCap: Array.from(newValue.state.showCap.entries()) },
    });
    sessionStorage.setItem(name, str);
  },
  removeItem: (name) => sessionStorage.removeItem(name),
};

export const useStore = create(
  persist(
    () => ({
      showCap: new Map<string, status>(),
      tracks: new Map<string, TextTrack>(),
    }),
    {
      name: "youtube multi storage",
      partialize: ({ showCap }) => ({ showCap }),
      storage,
    }
  )
);

export function setShowCap(langCode: string, show: status) {
  useStore.setState((prev) => ({
    showCap: new Map(prev.showCap).set(`${getVideoId()}.${langCode}`, show),
  }));

  const track = useStore.getState().tracks.get(langCode);
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
