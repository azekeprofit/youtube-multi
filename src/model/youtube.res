type ytName = {
  simpleText: string,
}

type ytCaptionKind = | @as("asr") Asr | None

type languageCode = LanguageCode(string)
type vssId = string
type videoId = string

type ytCaptionTrack = {
  baseUrl: string,
  vssId: vssId,
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
  videoId: videoId,
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
@send external toggleSubtitles: unit => unit = "toggleSubtitles"
@send external toggleSubtitlesOn: unit => unit = "toggleSubtitlesOn"

let getVideoPlayer = () =>
  switch Preact.get("#movie_player") {
  | Value(p) => Nullable.make(YoutubePlayer(p))
  | _ => Nullable.null
  }

let getVideoTag = () => Preact.get("#movie_player video")

let getVideoId = () =>
  switch getVideoPlayer() {
  | Value(p) => getPlayerResponse(p).videoDetails.videoId
  | _ => ``
  }

type captionId = CaptionId(videoId, vssId)

// export function addTrack(captionId: captionId, vssId: vssId) {
//   const track = getVideoTag().addTextTrack("captions", vssId, vssId);
//   addTrackToCache(captionId, track);
//   return track;
// }

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

let getAllTracks = () =>
  switch getVideoPlayer() {
  | Value(p) => {
      let response = getPlayerResponse(p)
      response.captions.playerCaptionsTracklistRenderer.captionTracks // ?? [];
    }
  | _ => []
  }
