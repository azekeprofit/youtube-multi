import { create } from "zustand";
import {
  persist,
  type PersistStorage,
  type StorageValue,
} from "zustand/middleware";
import { type captionId } from "./youtube";

type status = boolean | undefined;

interface youtubeMultiStorage {
  showCap: Map<captionId, status>;
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
  setItem: (name, newValue: StorageValue<youtubeMultiStorage>) => {
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
    }),
    {
      name: "youtube multi storage",
      storage,
    }
  )
);

export function setShowCap(captionId: captionId, show: status) {
  useStore.setState((prev) => ({
    showCap: new Map(prev.showCap).set(captionId, show),
  }));
}