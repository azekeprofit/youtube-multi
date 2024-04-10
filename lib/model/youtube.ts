import { addTrackToCache } from "./store";

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

export function addTrack(captionId: captionId, langCode: string) {
  const track = getVideoTag().addTextTrack("captions", langCode, langCode);
  addTrackToCache(captionId, track);
  return track;
}

export function addCue(
  track: TextTrack,
  capId: captionId,
  start: number,
  end: number,
  html: string,
  index: number
) {
  if (html.length) {
    const cue = new VTTCue(start, end, html);
    cue.id = `${capId}.${index.toString()}`;
    track.addCue(cue);
    return cue;
  }
}
