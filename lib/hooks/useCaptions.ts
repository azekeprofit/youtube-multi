
/// hook that returns captions in a youtube video

import { getVideoPlayer } from "../model/youtube";
import { forceUpdate } from "./forceUpdate";

/// re-renders on changing video
export function useCaptions() {
    const videoPlayer = getVideoPlayer();
    const update=forceUpdate();
  
    if (!videoPlayer.stateChangeListener) {
      const stateChangeListener = (videoPlayer.stateChangeListener = (e: number) => {
        if (e == -1) update(0);
      });
      videoPlayer.addEventListener("onStateChange", stateChangeListener);
    }
  
    const response = videoPlayer.getPlayerResponse();
    const allTracks =
      response?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
    return allTracks.length == 1
      ? allTracks
      : allTracks.filter((t) => t.kind != "asr");
  }