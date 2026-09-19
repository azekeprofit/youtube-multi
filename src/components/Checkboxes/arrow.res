type direction = [#left | #right]
external directionToString: direction => string = "%identity"
@jsx.component
let make = (~show: Signal.t<bool>, ~text, ~direction, ~attr) =>
  <span
    {...attr}
    classAsSignal={Signalish.fromSignal(
      Signal.useComputed(_ => `arrow ${direction->directionToString} ${show.value ? "show" : ""}`),
    )}
  >
    {text->Preact.string}
  </span>
