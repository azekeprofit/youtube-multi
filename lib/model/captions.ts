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

const sameLanguage = (lang1: string, lang2: string) => lang1 == lang2 || lang1.split('-')[0] == lang2.split('-')[0];

/// re-calculates when video changes
export const playerCaptions = signal<videoPlayerCaptions[]>([]);
videoUrlId.subscribe((v) => {
  const tracks = getAllTracks(videoPlayer.peek());
  const filteredTracks = tracks.length == 1 ? tracks : tracks.filter(track =>
    track.kind == 'asr' ?
      sameLanguage(navigator.language, track.languageCode) ?
        !tracks.some(({ languageCode, kind }) => kind !== 'asr' && sameLanguage(track.languageCode, languageCode)) : false
      : true);
  const filteredCaps = filteredTracks.map(track => ({ track, captionId: getCaptionIdFromVideoId(v, track) } as videoPlayerCaptions));
  if (filteredCaps.length == 1)
    setShowCap(filteredCaps[0].captionId, true);
  playerCaptions.value = filteredCaps;
  srtContainer.value = {};
})
