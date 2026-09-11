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
  | Types.YoutubePlayer(element) => {
      let stateChangeListener = _ =>
        videoUrlId.value = Youtube.getVideoId(Types.YoutubePlayer(element))
      element->WebAPI.Element.addEventListener(
        WebAPI.EventTypes.Custom("onStateChange"),
        stateChangeListener,
      )
      Signal.Cleanup(
        () =>
          element->WebAPI.Element.removeEventListener(
            WebAPI.EventTypes.Custom("onStateChange"),
            stateChangeListener,
          ),
      )
    }
  | _ => None
  }
)

type videoPlayerCaptions = {track: Types.ytCaptionTrack, captionId: Types.captionId}

// const sameLanguage = (lang1: string, lang2: string) => lang1 == lang2 || lang1.split('-')[0] == lang2.split('-')[0];

/// re-calculates when video changes
let playerCaptions = Signal.make([])
videoUrlId.subscribe(vId => {
  let tracks = Youtube.getAllTracks(videoPlayer.peek())
  let filteredCaps =
    tracks->Array.map(track => {track, captionId: Types.getCaptionId(vId, track.vssId)})
  playerCaptions.value = filteredCaps
  Store.srtContainer.value = dict{}
})

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
