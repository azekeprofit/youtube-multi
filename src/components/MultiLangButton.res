let pressed = Signal.make(false)
@jsx.component
let make = (~player, ~ytSettingsMenu) => {
  let anyCaptions = Signal.useComputed(_ =>
    Captions.playerCaptions.value->Array.length + Store.srtKeys.value->Array.length > 0
  )
  let pressedAndCaptions = Signal.useComputed(_ => anyCaptions.value && pressed.value)

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
      {Preact.createPortal(
        <div
          id="youtube-multi-caption-container"
          class="caption-window ytp-caption-window-bottom youtube-multi-bottom"
        >
          <Lines lines={Captions.youtubeLineKeys} />
          <Lines lines={Store.srtKeys} />
        </div>,
        player->Youtube.asElement,
      )}
    </Signal.show>
    <button
      class="ytp-subtitles-button ytp-button"
      ariaPressedAsSignal={Signalish.useComputed(_ =>
        pressedAndCaptions.value ? #"true" : #"false"
      )}
      onClick={toggleSubtitles}
      titleAsSignal={Signalish.useComputed(_ =>
        anyCaptions.value ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"
      )}
    >
      <CcIcon opacity={Signalish.useComputed(_ => anyCaptions.value ? "1.0" : "0.3")} />
    </button>
    {Preact.createPortal(<SrtMenuItem />, ytSettingsMenu)}
  </>
}
