module YtLangCheckbox = {
  @jsx.component
  let make = (~track, ~captionId) => {
    let {
      kind,
      languageCode: LanguageCode(lngText),
      vssId: VssId(vssIdText),
      baseUrl,
      name,
    }: Youtube.ytCaptionTrack = track
    Signal.useSignalEffect(() =>
      switch (Youtube.getVideoTag(), Captions.videoUrlId.value, Captions.videoPlayer.value) {
      | (Value(tag), Some(VideoId(videoId)), Some(player)) => {
          player->Youtube.toggleSubtitlesOn

          let track = switch Store.trackContainer.peek()->Dict.get(captionId->Types.asKey) {
          | Some(t) => t
          | _ => Store.addTrack(tag, captionId, vssIdText)
          }

          let showCap = Store.getShowCap(captionId)
          switch (track.cues, Pots.potsContainer.value->Dict.get(videoId)) {
          // // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
          | (Value(cueList), Some(pot)) if showCap && cueList->VTTCue.cueListLength == 0 => {
              // add stub cue
              Captions.addCue(track, captionId, -1.0, -1.0, "", -1)
              let xhr = XMLHttpRequest.make()
              xhr.onload = () => SrtSubtitle.loadSrtLine(track, captionId, xhr.responseText)
              xhr.open_(Get, `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`)
              xhr.responseType = Text
              xhr.send()

              None
            }
          | _ => None
          }
        }
      | _ => None
      }
    )

    let autoCaption = kind == Asr

    <CaptionCheckbox
      title={Signalish.fromValue(name->Youtube.extractName)}
      label={Signalish.fromValue(`${lngText}${autoCaption ? " (auto)" : ""}`)}
      captionId
    />
  }
}

@jsx.component
let make = () => {
  <Signal.for_ each={Captions.playerCaptions} getKey={c => c.captionId->Types.asKey}>
    {({track, captionId}, _) => <YtLangCheckbox track captionId />}
  </Signal.for_>
}
