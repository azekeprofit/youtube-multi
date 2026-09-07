/// signal that returns captions in a youtube video

import { effect, signal } from "@preact/signals";
import { setShowCap, srtContainer } from "./store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, type ytCaptionTrack, ytPlayerState, type videoId, type captionId } from "./youtube";

export const videoPlayer = signal<ReturnType<typeof getVideoPlayer> | undefined>(undefined);
export const videoUrlId = signal<videoId>(undefined);


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

export type videoPlayerCaptions = { track: ytCaptionTrack, captionId: captionId };

/// re-calculates when video changes
export const playerCaptions = signal<videoPlayerCaptions[]>([]);
videoUrlId.subscribe((v) => {
  const caps = getAllTracks(videoPlayer.peek()).map(track =>
    ({ track, captionId: getCaptionIdFromVideoId(v, track) } as videoPlayerCaptions));

  playerCaptions.value = caps.length == 1 ? caps : caps.filter(c => c.track.kind !== 'asr');
  if (caps.length == 1)
    setShowCap(caps[0].captionId, true);
  srtContainer.value = {};
})
