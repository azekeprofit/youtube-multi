type ytName = {
  simpleText: string,
}

type ytCaptionKind = | @as("asr") Asr | None

type languageCode = LanguageCode(string)

type ytCaptionTrack = {
  baseUrl: string,
  vssId: Store.vssId,
  languageCode: languageCode,
  name: ytName,
  kind: ytCaptionKind,
  isTranslatable: bool,
}

type ytTranslationLanguage = {
  languageCode: languageCode,
  languageName: ytName,
}

type ytTrackListRenderer = {
  captionTracks: array<ytCaptionTrack>,
  translationLanguages: array<ytTranslationLanguage>,
}

type ytVideoDetails = {
  author: string,
  channelId: string,
  lengthSeconds: int,
  shortDescription: string,
  videoId: Store.videoId,
  title: string,
}

type ytCaptions = {
  playerCaptionsTracklistRenderer: ytTrackListRenderer,
}

type ytPlayerResponse = {
  captions: ytCaptions,
  videoDetails: ytVideoDetails,
}

type ytPlayerState =
  | @as(-1) Unstarted
  | @as(0) Ended
  | @as(1) Playing
  | @as(2) Paused
  | @as(3) Buffering
  | @as(5) VideoCued

type stateChangeListener = ytPlayerState => unit
type eventType = | @as(`onStateChange`) OnStateChange
type ytPlayer = YoutubePlayer(WebAPI.DOMTypes.element)
@send external getPlayerResponse: ytPlayer => ytPlayerResponse = "getPlayerResponse"
@send
external addEventListener: (ytPlayer, eventType, stateChangeListener) => unit = "addEventListener"
@send
external removeEventListener: (ytPlayer, eventType, stateChangeListener) => unit =
  "removeEventListener"
@send external toggleSubtitles: ytPlayer => unit = "toggleSubtitles"
@send external toggleSubtitlesOn: ytPlayer => unit = "toggleSubtitlesOn"

let getVideoPlayer = () =>
  switch Preact.get("#movie_player") {
  | Value(p) => Nullable.make(YoutubePlayer(p))
  | _ => Nullable.null
  }

let getVideoTag = () => Preact.get("#movie_player video")

external asMediaElement: WebAPI.DOMTypes.element => WebAPI.DOMTypes.htmlVideoElement = "%identity"

let getVideoId = () =>
  switch getVideoPlayer() {
  | Value(p) => getPlayerResponse(p).videoDetails.videoId
  | _ => ``
  }

let addTrack = (
  videoTag: WebAPI.DOMTypes.element,
  captionId: Store.captionId,
  vssId: Store.vssId,
) => {
  let player = videoTag->asMediaElement
  let track =
    player->WebAPI.HTMLVideoElement.addTextTrack(~kind=Captions, ~label=vssId, ~language=vssId)
  Store.addTrackToCache(captionId, track)
}

// export function addCue(
//   track: TextTrack,
//   capId: captionId,
//   start: number,
//   end: number,
//   html: string,
//   index: number
// ) {
//   const cue = new VTTCue(start, end, html);
//   cue.id = `${capId}.${index.toString()}`;
//   track.addCue(cue);
// }

let getAllTracks = (p: ytPlayer) =>
  getPlayerResponse(p).captions.playerCaptionsTracklistRenderer.captionTracks // ?? [];
