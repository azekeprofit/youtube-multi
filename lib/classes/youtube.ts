import { useEffect, useMemo, useState } from "preact/hooks";

export interface ytName {
  simpleText: string;
}

export type ytCaptionKind = "asr" | undefined;

export interface ytCaptionTrack {
  baseUrl: string;
  // vssId:string;
  languageCode: string;
  name: ytName;
  kind: ytCaptionKind;
}

interface ytTrackListRenderer {
  captionTracks: ytCaptionTrack[];
}

interface ytVideoDetails {
  author: string;
  channelId: string;
  lengthSeconds: number;
  shortDescription: string;
  videoId: string;
  title: string;
}

interface ytCaptions {
  playerCaptionsTracklistRenderer: ytTrackListRenderer;
}

interface ytPlayerResponse {
  captions: ytCaptions;
  videoDetails: ytVideoDetails;
}
type stateChangeListener = (e: number) => void;
interface ytPlayer {
  getPlayerResponse: () => ytPlayerResponse;
  stateChangeListener: stateChangeListener;
  addEventListener: (
    event: "onStateChange",
    listener: stateChangeListener
  ) => void;
}

export function getVideoPlayer() {
  return document.querySelector("#movie_player") as unknown as ytPlayer;
}

export type videoId = string;
export function getVideoId(): videoId {
  return getVideoPlayer().getPlayerResponse().videoDetails.videoId;
}

export type captionId = string;
export function getCaptionId({ languageCode }: ytCaptionTrack): captionId {
  return `${getVideoId()}.${languageCode}`;
}

export function useCaptions() {
  const [vId, setVId] = useState(getVideoId());
  const player = getVideoPlayer();

  if (!player.stateChangeListener) {
    player.stateChangeListener = (e: number) => {
      if (e == -1) setVId(getVideoId());
    };
    player.addEventListener("onStateChange", player.stateChangeListener);
  }

  const response = player.getPlayerResponse();
  const allTracks = response?.captions?.playerCaptionsTracklistRenderer?.captionTracks??[];
  return allTracks.length == 1
    ? allTracks
    : allTracks.filter((t) => t.kind != "asr");
}
