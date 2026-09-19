let addCue = (track, captionId, start, end, html, index) => {
  let cue = VTTCue.make(start, end, html)
  cue.id = `${captionId->Types.asKey}.${index->Int.toString}`
  track->WebAPI.TextTrack.addCue(cue->VTTCue.asTrack)
}

let videoPlayer = Signal.make(None)
let videoUrlId = Signal.make(None)

Signal.effect(() => {
  let? Some(player) = videoPlayer.value
  let stateChangeListener = _ =>
    switch Youtube.getVideoId(player) {
    | Some(_) as v => videoUrlId.value = v
    | _ => ()
    }
  stateChangeListener()
  let element = player->Youtube.asElement
  element->WebAPI.Element.addEventListener(Custom("onStateChange"), stateChangeListener)
  Some(
    () => element->WebAPI.Element.removeEventListener(Custom("onStateChange"), stateChangeListener),
  )
})

let getLang = (Youtube.LanguageCode(l)) =>
  switch String.split(l, "-")[0] {
  | Some(lang) => lang
  | _ => ""
  }
let sameLanguage = (lang1, lang2) => lang1 == lang2 || lang1->getLang == lang2->getLang

type videoPlayerCaptions = {track: Youtube.ytCaptionTrack, captionId: Types.captionId}

/// re-calculates when video changes
let playerCaptions = Signal.make([])
videoUrlId.subscribe(vId => {
  let tracks = Youtube.getAllTracks(videoPlayer.peek())

  let filteredTracks = switch tracks {
  | [_] => tracks
  | _ =>
    tracks->Array.filter(t =>
      t.kind == Asr
        ? sameLanguage(LanguageCode(navigator.language), t.languageCode)
            ? tracks->Array.some(
                ({languageCode, kind}) => kind != Asr && sameLanguage(t.languageCode, languageCode),
              )
            : false
        : true
    )
  }

  let filteredCaps =
    filteredTracks->Array.map(track => {track, captionId: Types.getCaptionId(vId, track.vssId)})

  switch filteredCaps {
  | [{captionId}] => Store.setShowCap(captionId, Boolean(true))
  | _ => ()
  }
  playerCaptions.value = filteredCaps
  Store.srtContainer.value = dict{}
})
