@jsx.component
let make = (~player, ~ytSettingsMenu) => {
  let pressed = Signal.useSignal(false)

  let anyCaptions = Signal.useComputed(() =>
    Captions.playerCaptions.value->Array.length + Store.srtKeys.value->Array.length > 0
  )
  let pressedAndCaptions = Signal.useComputed(() => anyCaptions.value && pressed.value)

  let toggleSubtitles = _ =>
    if anyCaptions.value {
      pressed.value = !pressed.value
      player->Youtube.toggleSubtitles
      if !pressed.value {
        player->Youtube.toggleSubtitlesOn
      }
    }

  <>
    <Signal.show when_={pressedAndCaptions}>
      <ScrollablePanel />
    </Signal.show>
    <Signal.show when_={pressed}>
      {Preact.createPortal(<CaptionLines />, player->Youtube.asElement)}
    </Signal.show>
    <button
      class="ytp-subtitles-button ytp-button"
      ariaPressedAsSignal={Signalish.fromSignal(
        Signal.useComputed(() => pressedAndCaptions.value ? #"true" : #"false"),
      )}
      onClick={toggleSubtitles}
      title={anyCaptions.value
        ? "Subtitles/closed captions"
        : "Subtitles/closed captions unavailable"}
    >
      <CcIcon
        opacity={Signalish.fromSignal(Signal.useComputed(() => anyCaptions.value ? "1.0" : "0.3"))}
      />
    </button>
    {Preact.createPortal(<SrtMenuItem />, ytSettingsMenu)}
  </>
}
