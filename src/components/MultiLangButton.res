@jsx.component
let make = () => {
  Console.log(`rerender`)
  let pressed = Preact.useSignal(false)
  let text = Preact.useComputed(() => pressed.value ? `true` : `false`)
  <div>
    <p
      onClick={_ => {
        pressed.value = !pressed.value
      }}
    >
      {text->Preact.signalText}
      {Preact.string(`777`)}
    </p>
  </div>
}
