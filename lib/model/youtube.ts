import { addTrackToCache } from "./store";

export interface ytName {
  simpleText: string;
}

export type ytCaptionKind = "asr" | undefined;

type languageCode = string;
type vssId = string;

export interface ytCaptionTrack {
  baseUrl: string;
  vssId: vssId;
  languageCode: languageCode;
  name: ytName;
  kind: ytCaptionKind;
}

interface ytTranslationLanguage {
  languageCode: languageCode;
  languageName: ytName;
}

interface ytTrackListRenderer {
  captionTracks: ytCaptionTrack[];
  translationLanguages: ytTranslationLanguage[];
}

interface ytVideoDetails {
  author: string;
  channelId: string;
  lengthSeconds: number;
  shortDescription: string;
  videoId: videoId;
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

type eventListener = (
  event: "onStateChange",
  listener: stateChangeListener
) => void;

export interface ytPlayer {
  getPlayerResponse: () => ytPlayerResponse;
  addEventListener: eventListener;
  removeEventListener: eventListener;
  toggleSubtitles:()=>void;
  toggleSubtitlesOn:()=>void;
}

export function getVideoPlayer() {
  return document.querySelector("#movie_player") as unknown as ytPlayer;
}

export function getVideoTag() {
  return document.querySelector<HTMLVideoElement>("#movie_player video");
}

function getResponse() {
  return getVideoPlayer().getPlayerResponse();
}

export type videoId = string;
export function getVideoId() {
  return getResponse()?.videoDetails?.videoId as videoId;
}

export function extractName(name: ytName) {
  return name.simpleText;
}

export function getTranslation(langCode: languageCode) {
  const tl =
    getResponse()?.captions?.playerCaptionsTracklistRenderer
      ?.translationLanguages ?? [];
  return (
    tl.find((l) => l.languageCode === langCode)?.languageName?.simpleText ??
    langCode
  );
}

export type captionId = string;
export function getCaptionId({ vssId }: ytCaptionTrack) {
  return `${getVideoId()}.${vssId}` as captionId;
}

export function addTrack(captionId: captionId, vssId: vssId) {
  const track = getVideoTag().addTextTrack("captions", vssId, vssId);
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
