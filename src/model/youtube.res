type ytName ={
  simpleText: string,
}

type ytCaptionKind = @as("asr") Asr | None

type languageCode = LanguageCode(string)
type vssId = string
type videoId = string

type ytCaptionTrack ={
  baseUrl: string,
  vssId: vssId,
  languageCode: languageCode,
  name: ytName,
  kind: ytCaptionKind,
  isTranslatable: bool,
}

type ytTranslationLanguage= {
  languageCode: languageCode,
  languageName: ytName,
}

type ytTrackListRenderer= {
  captionTracks: array<ytCaptionTrack>,
  translationLanguages: array<ytTranslationLanguage>,
}

type ytVideoDetails ={
  author: string,
  channelId: string,
  lengthSeconds: int,
  shortDescription: string,
  videoId: videoId,
  title: string,
}

type ytCaptions ={
  playerCaptionsTracklistRenderer: ytTrackListRenderer,
}

type ytPlayerResponse ={
  captions: ytCaptions,
  videoDetails: ytVideoDetails,
}

type ytPlayerState=
  | @as(-1) Unstarted
  | @as(0) Ended
  | @as(1) Playing
  | @as(2) Paused
  | @as(3) Buffering
  | @as(5) VideoCued

type stateChangeListener = (ytPlayerState) => unit;

type eventListener = (string /* `onStateChange` */ , stateChangeListener) => unit;

type ytPlayer = {
  @meth getPlayerResponse: () => ytPlayerResponse,
  @meth addEventListener: eventListener,
  @meth removeEventListener: eventListener,
  @meth toggleSubtitles: () => unit,
  @meth toggleSubtitlesOn: () => unit,
}

let getVideoPlayer=()=>Dom.get("#movie_player") :> Option.t<ytPlayer>

let getVideoTag=()=> Dom.get("#movie_player video") :> Option.t<WebAPI.HTMLVideoElement.t>

let getVideoId=player=>player.getPlayerResponse().videoDetails.videoId


type captionId = CaptionId(videoId,vssId);

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

let getAllTracks=(player)=> switch player {
| Value(p)=>{
  let response = p.getPlayerResponse();
  response.captions.playerCaptionsTracklistRenderer.captionTracks // ?? [];
}
| _ =>[]
}
