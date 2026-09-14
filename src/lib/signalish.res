@unboxed type t<'v> = Signalish('v)

external fromSignal: Signal.t<'v> => t<'v> = "%identity"
external fromValue: 'v => t<'v> = "%identity"

external float: t<float> => Jsx.element = "%identity"
external int: t<int> => Jsx.element = "%identity"
external string: t<string> => Jsx.element = "%identity"
