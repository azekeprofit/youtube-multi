/// signal that returns captions in a youtube video

import { effect, signal } from "@preact/signals";
import { setShowCap, srtContainer } from "./store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, type ytCaptionTrack, ytPlayerState, type videoId } from "./youtube";

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
export const videoUrlId = signal<videoId>(undefined);

/// re-calculates when video changes
export const playerCaptions = signal<ytCaptionTrack[]>([]);

effect(() => {
  const player = videoPlayer.value;
  if (player) {
    function stateChangeListener() { // state: ytPlayerState
      const vId = getVideoId(player);
      if (vId)
        videoUrlId.value = vId;
    }
    stateChangeListener();
    player.addEventListener("onStateChange", stateChangeListener);
    return () =>
      player.removeEventListener("onStateChange", stateChangeListener);
  }
});


videoUrlId.subscribe((v) => {
  const caps = getAllTracks(videoPlayer.peek());
  playerCaptions.value = caps;
  if (caps.length == 1)
    setShowCap(getCaptionIdFromVideoId(v, caps[0]), true);
  srtContainer.value = {};
})
