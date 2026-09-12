let useComputed = Signal.useComputed
let createPortal = Preact.createPortal

@jsx.component
let make = () => {
  let pressed = Signal.useSignal(false)

  let anyCaptions = useComputed(() =>
    Captions.playerCaptions.value->Array.length + Store.srtKeys.value->Array.length > 0
  )
  let pressedAndCaptions = useComputed(() => anyCaptions.value && pressed.value)

  switch (
    Youtube.getVideoPlayer(),
    Preact.get(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`),
  ) {
  | (Some(player) as p, Value(ytSettingsMenu)) => {
      Captions.videoPlayer.value = p

      let toggleSubtitles = _ =>
        if anyCaptions.value {
          pressed.value = !pressed.value
          player->Types.toggleSubtitles
          if !pressed.value {
            player->Types.toggleSubtitlesOn
          }
        }

      <>
        <Signal.show when_={pressedAndCaptions}>
          <ScrollablePanel />
        </Signal.show>
        <Signal.show when_={pressed}>
          {createPortal(<CaptionLines />, player->Types.asElement)}
        </Signal.show>
        <button
          class="ytp-subtitles-button ytp-button"
          ariaPressedSignal={pressedAndCaptions}
          onClick={toggleSubtitles}
          title={anyCaptions.value
            ? "Subtitles/closed captions"
            : "Subtitles/closed captions unavailable"}
        >
          <CcIcon opacitySignal={useComputed(() => anyCaptions.value ? 1.0 : 0.3)} />
        </button>
        {createPortal(<SrtMenuItem />, ytSettingsMenu)}
      </>
    }
  | _ => <> </>
  }
}
