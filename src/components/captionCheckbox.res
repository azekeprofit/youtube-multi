@jsx.component
let make = (~checked, ~label, ~captionId, ~title) => {
  let checkedAsSignal = Signal.useComputed(() => captionId->Store.getShowCap)
  let Types.CaptionId(key) = captionId
  Signal.useSignalEffect(() =>
    switch Store.trackContainer.value->Dict.get(key) {
    | Some(track) => {
        track.mode = checkedAsSignal.value ? Showing : Hidden
        Signal.Cleanup(() => track.mode = Disabled)
      }
    | _ => None
    }
  )

  <label title>
    <input type_="checkbox" checkedAsSignal onInput={e => Store.setShowCap(captionId, None)} /> // JsxEvent.Form.currentTarget(e).checked ? Store.Date(Date.make()) : None
    {label->Preact.string}
  </label>
}
