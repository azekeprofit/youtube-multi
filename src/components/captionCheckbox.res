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

  <label {...Preact.props(switch title {
  | Signal.Signal(s) => {titleAsSignal: s}
  | String(s) => {title: s}
  | _ => {}
  })}>
    <input
      type_="checkbox"
      checkedAsSignal
      onInputEvent={e =>
        Store.setShowCap(
          captionId,
          e.currentTarget.checked ? Date(Date.make()->Date.toString) : None,
        )}
    />
    {switch label {
    | Signal.Signal(s) => s->Signal.signalText
    | String(s) => s->Preact.string
    | _ => <> </>
    }}
  </label>
}
