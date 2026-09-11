@jsx.component
let make = () => {
  let pressed = Signal.useSignal(false)
  let player = Youtube.getVideoPlayer()
  Captions.videoPlayer.value = player
  let anyCaptions = Signal.useComputed(() => (Captions.playerCaptions.value->Array.length + Store.srtKeys.value->Array.length) > 0)
  let pressedAndCaptions = Signal.useComputed(() => anyCaptions.value && pressed.value)

  let ytSettingsMenu = Preact.get(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`)

  let toggleSubtitles=_=> switch player {
  | Types.YoutubePlayer(p)=> if (anyCaptions.value) {
      pressed.value = !pressed.value
      Types.YoutubePlayer(p)->Types.toggleSubtitles
      if (!pressed.value) {
      Types.YoutubePlayer(p)->Types.toggleSubtitlesOn
      }
    }
    | _=>()
  }

  <>
    <Signal.show when_={pressedAndCaptions}>
    // <ScrollablePanel />
    </Signal.show>
    <Signal.show when_={pressed}>
    // {createPortal(<CaptionLines />, player)}
    </Signal.show>
    <button
      class="ytp-subtitles-button ytp-button"
      ariaPressedSignal={pressedAndCaptions}
      onClick={toggleSubtitles}
      title={anyCaptions.value ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
      <CcIcon opacitySignal={Signal.useComputed(()=>anyCaptions.value ? 1.0 : 0.3)} />
    </button>
    {Preact.createPortal(<SrtMenuItem />, ytSettingsMenu)}
  </>
}
