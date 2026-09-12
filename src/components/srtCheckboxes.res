let ellipseLimit = 4

module SrtCheckbox = {
  @jsx.component
  let make = (~captionId) => {
    let label = Signal.useComputed(() =>
      Store.srtContainer.value->Dict.get(captionId->Types.asKey)->Option.getOr("")
    )
    let ellipsedLabel = Signal.useComputed(() =>
      label.value->String.length > ellipseLimit
        ? `${label.value->String.substring(~start=0, ~end=ellipseLimit)}…`
        : label.value
    )

    <CaptionCheckbox label={Signal(ellipsedLabel)} title={Signal(label)} captionId />
  }
}

@jsx.component
let make = () => {
  <Signal.for_ each={Store.srtKeys}>
    {(key, _) => <SrtCheckbox key captionId={Types.CaptionId(key)} />}
  </Signal.for_>
}
