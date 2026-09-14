@jsx.component
let make = (~label, ~captionId, ~title) => {
  let checked = Signal.useComputed(() => captionId->Store.getShowCap)
  Signal.useSignalEffect(() =>
    switch Store.trackContainer.value->Dict.get(captionId->Types.asKey) {
    | Some(track) => {
        track.mode = checked.value ? Showing : Hidden
        Cleanup(() => track.mode = Disabled)
      }
    | _ => None
    }
  )

  <label titleAsSignal={title}>
    <input
      type_="checkbox"
      checkedAsSignal={Signal(checked)}
      onInputEvent={e =>
        Store.setShowCap(
          captionId,
          e.currentTarget.checked ? Date(Date.make()->Date.toString) : None,
        )}
    />
    {label->Signalish.string}
  </label>
}
