type signalMethods<'t> = {
  @meth subscribe: ('t => unit) => unit,
  @meth peek: unit => 't,
}

type t<'t> = {
  mutable value: 't,
  ...signalMethods<'t>,
}

type ref<'t> = {
  mutable current: 't,
  ...signalMethods<'t>,
}

@unboxed type cleanup = Cleanup(unit => unit) | None

@module("preact/signals")
external useSignalEffect: (unit => cleanup) => unit = "useSignalEffect"

@module("preact/signals")
external useSignalEffectWithCleanup: (unit => unit => unit) => unit = "useSignalEffect"

@module("@preact/signals")
external useSignal: 'a => t<'a> = "useSignal"

@module("@preact/signals")
external useSignalRef: 'a => ref<'a> = "useSignalRef"

@module("@preact/signals")
external make: 'a => t<'a> = "signal"

@module("@preact/signals")
external computed: (unit => 'a) => t<'a> = "computed"

@module("@preact/signals")
external effect: (unit => cleanup) => unit = "effect"

@module("@preact/signals")
external useComputed: (unit => 't) => t<'t> = "useComputed"

external signalText: t<string> => Jsx.element = "%identity"
