/// hook that returns captions in a youtube video

import { useSignal, useSignalEffect } from "@preact/signals";
import { getAllTracks, getVideoPlayer, ytPlayerState } from "../model/youtube";


/// re-renders on changing video
export function useCaptions() {
  const videoPlayer = getVideoPlayer();
  const captions = useSignal(getAllTracks(videoPlayer));

  useSignalEffect(() => {

    function stateChangeListener(e: ytPlayerState) {
      if (e == ytPlayerState.playing || e == ytPlayerState.unstarted) {
        captions.value = getAllTracks(videoPlayer);
        // console.log(e);
        // console.log(response);

      }
    };
    videoPlayer.addEventListener("onStateChange", stateChangeListener);
    return () =>
      videoPlayer.removeEventListener("onStateChange", stateChangeListener);
  });


  return captions;
}
