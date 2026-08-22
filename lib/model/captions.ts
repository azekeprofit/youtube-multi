/// signal that returns captions in a youtube video

import { createEffect, createSignal } from "solid-js";
import { setShowCap, setSrt } from "./store";
import { getAllTracks, getCaptionIdFromVideoId, getVideoId, getVideoPlayer, type videoId, type ytCaptionTrack } from "./youtube";

export const [videoUrlId, setVideoUrl] = createSignal<videoId>();

/// re-calculates when video changes
export const [playerCaptions, setCaptions] = createSignal<ytCaptionTrack[]>([]);
export const [videoPlayer, setVideoPlayer] = createSignal<ReturnType<typeof getVideoPlayer>>(null);

createEffect(() => videoPlayer(),
  (player) => {
    if(player){
    function stateChangeListener() { // state: ytPlayerState
      const vId = getVideoId(player);
      if (vId)
        setVideoUrl(vId);
    }
    stateChangeListener();
    player.addEventListener("onStateChange", stateChangeListener);
    return () =>
      player.removeEventListener("onStateChange", stateChangeListener);
    }
  });

createEffect(() => videoUrlId(), (videoUrlId) => {
  const caps = getAllTracks(videoPlayer());
  setCaptions(caps);
  if (caps.length == 1)
    setShowCap(getCaptionIdFromVideoId(videoUrlId, caps[0]), true);
  setSrt({});
})
