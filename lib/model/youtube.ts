import { useReducer } from "preact/hooks";

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
export interface ytPlayer {
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

export function getVideoTag() {
  return document.querySelector<HTMLVideoElement>("#movie_player video");
}

export type videoId = string;
export function getVideoId(): videoId {
  return getVideoPlayer().getPlayerResponse()?.videoDetails?.videoId;
}

export type captionId = string;
export function getCaptionId({ languageCode }: ytCaptionTrack): captionId {
  return `${getVideoId()}.${languageCode}`;
}
