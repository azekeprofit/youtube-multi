@jsx.component
let make = _ => {
  <Signal.for_ each={Store.srtKeys}>
    {(key, _) => <SrtCheckbox key captionId={Types.CaptionId(key)} />}
  </Signal.for_>
}
