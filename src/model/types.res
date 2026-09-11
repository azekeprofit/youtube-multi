@unboxed type vssId = VssId(string)
@unboxed type videoId = VideoId(string) | @as(null) NoId
@unboxed type captionId = CaptionId(string)

type ytName = {
  simpleText: string,
}

type ytCaptionKind = | @as("asr") Asr | None

type languageCode = LanguageCode(string)

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

type ytVideoDetails = {
  author: string,
  channelId: string,
  lengthSeconds: int,
  shortDescription: string,
  videoId: videoId,
  title: string,
}

type ytPlayerResponse = {
  captions: {
    playerCaptionsTracklistRenderer: {
      captionTracks: array<ytCaptionTrack>,
      translationLanguages: array<ytTranslationLanguage>,
    },
  },
  videoDetails: ytVideoDetails,
}

type ytPlayerState =
  | @as(-1) Unstarted
  | @as(0) Ended
  | @as(1) Playing
  | @as(2) Paused
  | @as(3) Buffering
  | @as(5) VideoCued

@unboxed type ytPlayer = YoutubePlayer(WebAPI.DOMTypes.element)
@unboxed type ytPlayerOptional = YoutubePlayer(WebAPI.DOMTypes.element) | @as(null) NoPlayer
let getCaptionId = (videoId, VssId(vssId)) => CaptionId(
  switch videoId {
  | VideoId(v) => `${v}.${vssId}`
  | _ => ``
  },
)

type stateChangeListener = ytPlayerState => unit
@send external getPlayerResponse: ytPlayer => ytPlayerResponse = "getPlayerResponse"
@send external toggleSubtitles: ytPlayer => unit = "toggleSubtitles"
@send external toggleSubtitlesOn: ytPlayer => unit = "toggleSubtitlesOn"
