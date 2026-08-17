/// signal that returns captions in a youtube video

import { computed, signal } from "@preact/signals";
import { setShowCap, srtContainer } from "../model/store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, ytPlayerState, type videoId } from "../model/youtube";

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
export const videoUrlId = signal<videoId>(undefined);

/// re-calculates when video changes
export const playerCaptions = computed(() => ({ id: videoUrlId.value, captions: getAllTracks(videoPlayer.value) }));

videoPlayer.subscribe(v => {
  if (v) {
    function stateChangeListener(state: ytPlayerState) {
      videoUrlId.value = getVideoId(v);
    }
    v.addEventListener("onStateChange", stateChangeListener);
    return () =>
      v.removeEventListener("onStateChange", stateChangeListener);
  }
});


videoUrlId.subscribe((videoId) => {
  const caps = playerCaptions.peek().captions;
  if (caps.length == 1)
    setShowCap(getCaptionIdFromVideoId(videoId, caps[0]), true);
  srtContainer.value = {};
})
