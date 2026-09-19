type ytName = {
  simpleText: string,
}

let extractName = ytName => ytName.simpleText

type ytCaptionKind = | @as("asr") Asr | None

@unboxed type languageCode = LanguageCode(string)

type ytCaptionTrack = {
  baseUrl: string,
  vssId: Types.vssId,
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
  videoDetails?: {
    author: string,
    channelId: string,
    lengthSeconds: int,
    shortDescription: string,
    videoId: Types.videoId,
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

@unboxed type ytPlayer = Player(WebAPI.DOMTypes.element)
@send external getPlayerResponse: ytPlayer => Null.t<ytPlayerResponse> = "getPlayerResponse"
@send external toggleSubtitles: ytPlayer => unit = "toggleSubtitles"
@send external toggleSubtitlesOn: ytPlayer => unit = "toggleSubtitlesOn"
let asElement = (Player(element)) => element

let getVideoId = player => {
  let? Some(p) = getPlayerResponse(player)->Null.toOption
  let? Some(details) = p.videoDetails
  Some(details.videoId)
}

let getVideoTag = _ => Preact.get("#movie_player video")

let getAllTracks = (player: option<ytPlayer>) =>
  {
    let? Some(p) = player
    let? Some(pl) = getPlayerResponse(p)->Null.toOption
    Some(pl.captions.playerCaptionsTracklistRenderer.captionTracks)
  }->Option.getOr([])
