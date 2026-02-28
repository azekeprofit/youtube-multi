/// hook that returns captions in a youtube video

import { useEffect } from "preact/hooks";
import { getVideoPlayer, ytPlayerState } from "../model/youtube";
import { forceUpdate } from "./forceUpdate";

/// re-renders on changing video
export function useCaptions() {
  const videoPlayer = getVideoPlayer();
  const update = forceUpdate();


  const response = videoPlayer.getPlayerResponse();
  const allTracks =
    response?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];


  useEffect(() => {
    const stateChangeListener = (e: ytPlayerState) => {
      if (e == ytPlayerState.playing || e == ytPlayerState.unstarted) {
        update(0);
        // console.log(e);
        // console.log(response);
      }
    };
    videoPlayer.addEventListener("onStateChange", stateChangeListener);
    return () =>
      videoPlayer.removeEventListener("onStateChange", stateChangeListener);
  }, []);


  return allTracks.length == 1
    ? allTracks
    : allTracks.filter((t) => t.kind != "asr");
}
