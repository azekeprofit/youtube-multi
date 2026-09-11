let useComputed = Signal.useComputed
let createPortal = Preact.createPortal

@jsx.component
let make = () => {
  let pressed = Signal.useSignal(false)
  let player = Youtube.getVideoPlayer()
  Captions.videoPlayer.value = player
  let anyCaptions = useComputed(() =>
    Captions.playerCaptions.value->Array.length + Store.srtKeys.value->Array.length > 0
  )
  let pressedAndCaptions = useComputed(() => anyCaptions.value && pressed.value)

  let ytSettingsMenu = Preact.get(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`)

  let toggleSubtitles = _ =>
    switch (player, anyCaptions.value) {
    | (Types.YoutubePlayer(p), true) => {
        pressed.value = !pressed.value
        Types.YoutubePlayer(p)->Types.toggleSubtitles
        if !pressed.value {
          Types.YoutubePlayer(p)->Types.toggleSubtitlesOn
        }
      }
    | _ => ()
    }

  <>
    <Signal.show when_={pressedAndCaptions}>
      <ScrollablePanel />
    </Signal.show>
    <Signal.show when_={pressed}>
      {createPortal(<CaptionLines />, player->Types.asNullableElement)}
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
