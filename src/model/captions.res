module VTTCue = {
  @new external make: (float, float, string) => WebAPI.WebVTTTypes.textTrackCue = "VTTCue"
}

let addCue = (
  track: WebAPI.WebVTTTypes.textTrack,
  Types.CaptionId(capId),
  start: float,
  end: float,
  html: string,
  index: int,
) => {
  let cue = VTTCue.make(start, end, html)
  cue.id = `${capId}.${index->Int.toString}`
  track->WebAPI.TextTrack.addCue(cue)
}

let videoPlayer = Signal.make(Types.NoPlayer)
let videoUrlId = Signal.make(Types.NoId)

Signal.effect(() =>
  switch videoPlayer.value {
  | Types.YoutubePlayer(p) => {
      let player: Types.ytPlayer = Types.YoutubePlayer(p)
      let stateChangeListener = state => videoUrlId.value = Youtube.getVideoId(player)
      player->Types.addPlayerEventListener(Types.OnStateChange, stateChangeListener)
      Signal.Cleanup(
        () => player->Types.removePlayerEventListener(Types.OnStateChange, stateChangeListener),
      )
    }
  | _ => None
  }
)

// type videoPlayerCaptions = { track: Youtube.ytCaptionTrack, captionId: captionId };

// const sameLanguage = (lang1: string, lang2: string) => lang1 == lang2 || lang1.split('-')[0] == lang2.split('-')[0];

// /// re-calculates when video changes
// export const playerCaptions = signal<videoPlayerCaptions[]>([]);
// videoUrlId.subscribe((v) => {
//   const tracks = getAllTracks(videoPlayer.peek());
//   const filteredTracks = tracks.length == 1 ? tracks : tracks.filter(track =>
//     track.kind == 'asr' ?
//       sameLanguage(navigator.language, track.languageCode) ?
//         !tracks.some(({ languageCode, kind }) => kind !== 'asr' && sameLanguage(track.languageCode, languageCode)) : false
//       : true);
//   const filteredCaps = filteredTracks.map(track => ({ track, captionId: getCaptionIdFromVideoId(v, track) } as videoPlayerCaptions));
//   if (filteredCaps.length == 1)
//     setShowCap(filteredCaps[0].captionId, true);
//   playerCaptions.value = filteredCaps;
//   srtContainer.value = {};
// })
