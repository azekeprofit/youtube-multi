import { create } from "zustand";
import {
  persist
} from "zustand/middleware";
import { type captionId } from "./youtube";

export type captionStatus = boolean | undefined;

export const useStore = create(
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
  useStore.setState((prev) => ({
    showCap: {...prev.showCap,[captionId]:show},
  }));
}