type t<'v> = Signal(Signal.t<'v>) | Value('v)

let ish = ish =>
  switch ish {
  | Signal(s) => s.value
  | Value(v) => v
  }

external float: float => Jsx.element = "%identity"
let float = s => s->ish->float
external int: int => Jsx.element = "%identity"
let float = s => s->ish->int
external string: string => Jsx.element = "%identity"
let string = s => s->ish->string
