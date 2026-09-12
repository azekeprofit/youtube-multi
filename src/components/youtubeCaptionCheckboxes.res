module YtLangCheckbox = {
  @jsx.component
  let make = (~track, ~captionId) => {
    let {kind, languageCode, vssId, baseUrl, name}: Types.ytCaptionTrack = track
    let Types.LanguageCode(lngText) = languageCode
    let Types.VssId(vssIdText) = vssId
    Signal.useSignalEffect(() =>
      switch Youtube.getVideoTag() {
      | Value(tag) => {
          let showCap = Store.showCaps.value->Dict.get(captionId->Types.asKey)
          switch Captions.videoUrlId.value {
          | Some(VideoId(videoId)) =>
            switch (Pots.potsContainer.value->Dict.get(videoId), Captions.videoPlayer.value) {
            | (Some(pot), Some(player)) => {
                player->Types.toggleSubtitlesOn

                let track = switch Store.trackContainer.peek()->Dict.get(captionId->Types.asKey) {
                | Some(t) => t
                | _ => Store.addTrack(tag, captionId, vssIdText)
                }

                // // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
                // if (showCap && track?.cues?.length === 0 && pot) {
                //   // add stub cue
                //   addCue(track, captionId, -1, -1, '', -1);
                //   const xhr = new XMLHttpRequest();
                //   xhr.onload = () => loadSrtLine(track, captionId, xhr.responseText);
                //   xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
                //   xhr.responseType = "text";
                //   xhr.send();
                // }
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
      title={String(name->Types.extractName)}
      label={String(`${lngText}${autoCaption ? " (auto)" : ""}`)}
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
