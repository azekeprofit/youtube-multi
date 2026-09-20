@jsx.component
let make = (~lines) =>
  <Signal.for_ each={lines} getKey={Types.identity}>
    {(key, _) => <ActiveTrack captionId={CaptionId(key)} />}
  </Signal.for_>
