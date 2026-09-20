let ellipseLimit = 4

@jsx.component
let make = (~captionId) => {
  let label = Signal.useComputed(_ =>
    Store.srtContainer.value->Dict.get(captionId->Types.asKey)->Option.getOr("")
  )
  let ellipsedLabel = Signal.useComputed(_ =>
    label.value->String.length > ellipseLimit
      ? `${label.value->String.substring(~start=0, ~end=ellipseLimit)}…`
      : label.value
  )

  <CaptionCheckbox
    label={Signalish.fromSignal(ellipsedLabel)} title={Signalish.fromSignal(label)} captionId
  />
}
