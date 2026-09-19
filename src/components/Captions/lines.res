@jsx.component
let make = (~lines) =>
  <Signal.for_ each={lines}>
    {(key, _) => <ActiveTrack key captionId={CaptionId(key)} />}
  </Signal.for_>
