/// hook that returns captions in a youtube video

import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { getAllTracks, getVideoPlayer, ytPlayerState } from "../model/youtube";


/// re-renders on changing video
export function useCaptions() {
  const videoPlayer = getVideoPlayer();
  const update = useSignal(0);
  const captions = useComputed(() => {
    update.value;
    const allTracks = getAllTracks(videoPlayer);

    return allTracks.length == 1
      ? allTracks
      : allTracks.filter((t) => t.kind != "asr");
  });

  useSignalEffect(() => {

    function stateChangeListener(e: ytPlayerState) {
      if (e == ytPlayerState.playing || e == ytPlayerState.unstarted) {
        update.value++;
      }
    };
    videoPlayer.addEventListener("onStateChange", stateChangeListener);
    return () =>
      videoPlayer.removeEventListener("onStateChange", stateChangeListener);
  });


  return captions;
}
