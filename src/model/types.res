@unboxed type vssId = VssId(string)
@unboxed type captionId = CaptionId(string)
@unboxed type videoId = VideoId(string)

type ytName = {
  simpleText: string,
}

let extractName = ytName => ytName.simpleText

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

type ytPlayerResponse = {
  captions: {
    playerCaptionsTracklistRenderer: {
      captionTracks: array<ytCaptionTrack>,
      translationLanguages: array<ytTranslationLanguage>,
    },
  },
  videoDetails: {
    author: string,
    channelId: string,
    lengthSeconds: int,
    shortDescription: string,
    videoId: videoId,
    title: string,
  },
}

type ytPlayerState =
  | @as(-1) Unstarted
  | @as(0) Ended
  | @as(1) Playing
  | @as(2) Paused
  | @as(3) Buffering
  | @as(5) VideoCued

type stateChangeListener = ytPlayerState => unit

let getCaptionId = (videoId, VssId(vssId)) => CaptionId(
  switch videoId {
  | Some(VideoId(v)) => `${v}.${vssId}`
  | _ => ``
  },
)
let asKey = (CaptionId(key)) => key

@unboxed type ytPlayer = YoutubePlayer(WebAPI.DOMTypes.element)
@send external getPlayerResponse: ytPlayer => ytPlayerResponse = "getPlayerResponse"
@send external toggleSubtitles: ytPlayer => unit = "toggleSubtitles"
@send external toggleSubtitlesOn: ytPlayer => unit = "toggleSubtitlesOn"
let asElement = (YoutubePlayer(element)) => element
