module YtLangCheckbox = {
  @jsx.component
  let make = (~track, ~captionId) => {
    let {kind, languageCode, vssId, baseUrl, name}: Types.ytCaptionTrack = track
    let Types.LanguageCode(lngText) = languageCode
    let Types.VssId(vssIdText) = vssId
    Signal.useSignalEffect(() =>
      switch Youtube.getVideoTag() {
      | Value(tag) => {
          let showCap = Store.getShowCap(captionId)
          switch Captions.videoUrlId.value {
          | Some(VideoId(videoId)) =>
            switch (Pots.potsContainer.value->Dict.get(videoId), Captions.videoPlayer.value) {
            | (Some(pot), Some(player)) => {
                player->Types.toggleSubtitlesOn

                let track = switch Store.trackContainer.peek()->Dict.get(captionId->Types.asKey) {
                | Some(t) => t
                | _ => Store.addTrack(tag, captionId, vssIdText)
                }
                switch track.cues {
                // // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
                | Value(cueList)
                  if showCap && cueList->VTTCue.cueListToArray->Array.length == 0 => {
                    // add stub cue
                    Captions.addCue(track, captionId, -1.0, -1.0, "", -1)
                    let xhr = XMLHttpRequest.make()
                    xhr.onload = () => SrtSubtitle.loadSrtLine(track, captionId, xhr.responseText)
                    xhr.open_(Get, `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`)
                    xhr.responseType = Text
                    xhr.send()
                  }
                | _ => ()
                }
              }
            | _ => ()
            }
          | _ => ()
          }
          None
        }
      | _ => None
      }
    )

    let autoCaption = kind == Asr

    <CaptionCheckbox
      title={name->Types.extractName} label={`${lngText}${autoCaption ? " (auto)" : ""}`} captionId
    />
  }
}

@jsx.component
let make = () => {
  <Signal.for_ each={Captions.playerCaptions} getKey={c => c.captionId->Types.asKey}>
    {({track, captionId}, _) => <YtLangCheckbox track captionId />}
  </Signal.for_>
}
