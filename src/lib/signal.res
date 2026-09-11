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

@module("@preact/signals")
external useSignalEffect: (unit => cleanup) => unit = "useSignalEffect"

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

type showProps = {@as("when") when_: t<bool>, fallback?: Jsx.element, children?: Jsx.element}
@module("@preact/signals/utils")
external show: showProps => Jsx.element = "Show"
let show = show

type forProps<'val> = {
  each: t<array<'val>>,
  fallback?: Jsx.element,
  getKeys?: 'val => string,
  children: ('val, int) => Jsx.element,
}
@module("@preact/signals/utils")
external for_: forProps<'val> => Jsx.element = "For"
let for_ = for_
