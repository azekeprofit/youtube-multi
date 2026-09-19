@jsx.component
let make = _ =>
  <div
    id="youtube-multi-caption-container"
    class="caption-window ytp-caption-window-bottom youtube-multi-bottom"
  >
    <Lines lines={Captions.youtubeLineKeys} />
    <Lines lines={Store.srtKeys} />
  </div>
