/// hook that returns captions in a youtube video

import { computed, effect, signal } from "@preact/signals";
import { getAllTracks, getVideoPlayer, ytPlayerState } from "../model/youtube";

// this used to be a hook that i turned into a global signal

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
const playerState = signal<ytPlayerState | undefined>(undefined);

/// re-calculates on changing video
export const captions = computed(() => {
  if (playerState.value === ytPlayerState.playing || playerState.value === ytPlayerState.unstarted) {
    const allTracks = getAllTracks(videoPlayer.value);

    return allTracks.length == 1
      ? allTracks
      : allTracks.filter((t) => t.kind != "asr");
  }
  return []
});

effect(() => {
  const v = videoPlayer.value;
  function stateChangeListener(e: ytPlayerState) {
    playerState.value = e;
  }
  v?.addEventListener("onStateChange", stateChangeListener);
  return () =>
    v?.removeEventListener("onStateChange", stateChangeListener);
});
