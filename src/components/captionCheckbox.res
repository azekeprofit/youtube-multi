@jsx.component
let make = (~label, ~captionId, ~title) => {
  let checkedAsSignal = Signal.useComputed(() => captionId->Store.getShowCap)
  Signal.useSignalEffect(() =>
    switch Store.trackContainer.value->Dict.get(captionId->Types.asKey) {
    | Some(track) => {
        track.mode = checkedAsSignal.value ? Showing : Hidden
        Cleanup(() => track.mode = Disabled)
      }
    | _ => None
    }
  )

  <label title>
    <input
      type_="checkbox"
      checked={checkedAsSignal->Signal.signalish}
      onInputEvent={e =>
        Store.setShowCap(
          captionId,
          e.currentTarget.checked ? Date(Date.make()->Date.toString) : None,
        )}
    />
    {label->Preact.string}
  </label>
}
