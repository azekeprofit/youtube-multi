let useComputed = Signal.useComputed

@jsx.component
let make = () => {
  let ytLines = useComputed(() =>
    Captions.playerCaptions.value->Array.map(({captionId}) => captionId)
  )
  <div
    id="youtube-multi-caption-container"
    class="caption-window ytp-caption-window-bottom youtube-multi-bottom"
  >
    // <Lines lines={ytLines} />
    // <Lines lines={srtKeys} />
  </div>
}
