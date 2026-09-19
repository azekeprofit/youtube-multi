@jsx.component
let make = (~label, ~captionId, ~title) => {
  let checked = Signal.useComputed(() => captionId->Store.getShowCap)
  Signal.useSignalEffect(() => {
    let? Some(track) = Store.trackContainer.value->Dict.get(captionId->Types.asKey)
    track.mode = checked.value ? Showing : Hidden
    Some(() => track.mode = Disabled)
  })

  <label titleAsSignal={title}>
    <input
      type_="checkbox"
      checkedAsSignal={Signalish.fromSignal(checked)}
      onInputEvent={e =>
        Store.setShowCap(
          captionId,
          e.currentTarget.checked ? Date(Date.make()->Date.toString) : None,
        )}
    />
    {label->Signalish.string}
  </label>
}
