/// hook that returns captions in a youtube video

import { computed, effect, signal } from "@preact/signals";
import { setShowCap, srtContainer } from "../model/store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, ytPlayerState, type videoId } from "../model/youtube";

// this used to be a hook that i turned into a global signal

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
const playerState = signal<ytPlayerState>(ytPlayerState.unstarted);
export const videoUrlId = signal<videoId>(undefined);

/// re-calculates on changing video
export const playerCaptions = computed(() => ({ state: playerState.value, captions: videoUrlId.value ? getAllTracks(videoPlayer.value) : [] }));

effect(() => {
  const v = videoPlayer.value;
  if (v) {
    function stateChangeListener(state: ytPlayerState) {
      if (state == ytPlayerState.playing || state == ytPlayerState.unstarted)
        playerState.value = state;
    }
    v.addEventListener("onStateChange", stateChangeListener);
    return () =>
      v.removeEventListener("onStateChange", stateChangeListener);
  }
});


effect(() => {
  if (playerCaptions.value.captions.length == 1)
    setShowCap(getCaptionIdFromVideoId(videoUrlId.value, playerCaptions.value.captions[0]), true);
  srtContainer.value = {};
})
