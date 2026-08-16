/// signal that returns captions in a youtube video

import { computed, effect, signal } from "@preact/signals";
import { setShowCap, srtContainer } from "../model/store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, ytPlayerState, type videoId } from "../model/youtube";

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
const playerState = signal<ytPlayerState | undefined>(undefined);
export const videoUrlId = signal<videoId>(undefined);

/// re-calculates when video changes
export const playerCaptions = computed(() => ({ state: playerState.value, id: videoUrlId.value, captions: getAllTracks(videoPlayer.value) }));

effect(() => {
  const v = videoPlayer.value;
  if (v) {
    function stateChangeListener(state: ytPlayerState) {
      if (state == ytPlayerState.playing || state == ytPlayerState.unstarted)
        playerState.value = state;
      videoUrlId.value = getVideoId(v);
    }
    v.addEventListener("onStateChange", stateChangeListener);
    return () =>
      v.removeEventListener("onStateChange", stateChangeListener);
  }
});


effect(() => {
  videoUrlId.value;
  const caps = playerCaptions.peek().captions;
  if (caps.length == 1)
    setShowCap(getCaptionIdFromVideoId(videoUrlId.value, caps[0]), true);
  srtContainer.value = {};
})
