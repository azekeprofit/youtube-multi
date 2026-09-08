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
      {Preact.useComputed(()=>pressed.value ? `true` : `false`)->Preact.signalText}
      {Preact.string(`999999`)}
    </p>
  </div>
}
