@jsx.component
let make = () => {
  Console.log(`rerender`)
  let pressed = Signal.useSignal(false)
  let text = Signal.useComputed(() => pressed.value ? `true` : `false`)
  <div>
    <p
      onClick={_ => {
        pressed.value = !pressed.value
      }}
    >
      {text->Signal.signalText}
      {Preact.string(`777`)}
    </p>
  </div>
}
