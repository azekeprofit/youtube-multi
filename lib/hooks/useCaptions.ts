/// hook that returns captions in a youtube video

import { computed, effect, signal } from "@preact/signals";
import { setShowCap, srtContainer } from "../model/store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, ytPlayerState } from "../model/youtube";

// this used to be a hook that i turned into a global signal

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
const playerState = signal<{ state: ytPlayerState, id: string }>({ state: ytPlayerState.unstarted, id: '' });

/// re-calculates on changing video
export const playerCaps = computed(() => ({ player: playerState.value, captions: getAllTracks(videoPlayer.value) }));

effect(() => {
  const v = videoPlayer.value;
  if (v) {
    function stateChangeListener(state: ytPlayerState) {
      if (state == ytPlayerState.playing || state == ytPlayerState.unstarted)
        playerState.value = { id: getVideoId(), state };
    }
    v.addEventListener("onStateChange", stateChangeListener);
    return () =>
      v.removeEventListener("onStateChange", stateChangeListener);
  }
});


effect(() => {
  if (playerCaps.value.captions.length == 1)
    setShowCap(getCaptionIdFromVideoId(playerState.value.id, playerCaps.value[0]), true);
  srtContainer.value = {};
})
