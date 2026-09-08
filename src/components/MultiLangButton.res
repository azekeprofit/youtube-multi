let pressed = Preact.signal(false)
pressed.subscribe(p => Console.log(p))->ignore

@jsx.component
let make = () => {
  Console.log(`rerender`)
  <div>
    <p
      onClick={_ => {
        pressed.value = !pressed.value
      }}
    >
      {Preact.string(pressed.value ? `true` : `false`)}
    </p>
  </div>
}
