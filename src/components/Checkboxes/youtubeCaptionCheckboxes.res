@jsx.component
let make = _ => {
  <Signal.for_ each={Captions.playerCaptions} getKey={c => c.captionId->Types.asKey}>
    {({track, captionId}, _) => <YtLangCheckbox track captionId />}
  </Signal.for_>
}
