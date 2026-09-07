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

function myLanguage(langCode: string) {
  const browserLang = navigator.language.split('-')[0];
  return langCode == browserLang || langCode.startsWith(`${browserLang}-`)
}

/// re-calculates when video changes
export const playerCaptions = signal<videoPlayerCaptions[]>([]);
videoUrlId.subscribe((v) => {
  const caps = getAllTracks(videoPlayer.peek()).map(track =>
    ({ track, captionId: getCaptionIdFromVideoId(v, track) } as videoPlayerCaptions));


  const filteredCaps = caps.length == 1 ? caps : caps.filter(({ track }) =>
    track.kind == 'asr' ?
       myLanguage(track.languageCode) ?
        !caps.some(({ track: { languageCode, kind } }) => kind !== 'asr' && myLanguage(languageCode)) : false
      : true);
  if (filteredCaps.length == 1)
    setShowCap(filteredCaps[0].captionId, true);
  playerCaptions.value = filteredCaps;
  srtContainer.value = {};
})
