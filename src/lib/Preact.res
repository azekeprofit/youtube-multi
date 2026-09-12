// Preact.res
/* Below is a number of aliases to the common `Jsx` module */
type element = Jsx.element

type component<'props> = Jsx.component<'props>

type componentLike<'props, 'return> = Jsx.componentLike<'props, 'return>

@module("preact/jsx-runtime")
external jsx: (component<'props>, 'props) => element = "jsx"

@module("preact/jsx-runtime")
external jsxKeyed: (component<'props>, 'props, ~key: string=?, @ignore unit) => element = "jsx"

@module("preact/jsx-runtime")
external jsxs: (component<'props>, 'props) => element = "jsxs"

@module("preact/jsx-runtime")
external jsxsKeyed: (component<'props>, 'props, ~key: string=?, @ignore unit) => element = "jsxs"

external array: array<element> => element = "%identity"
@val external null: element = "null"

external float: float => element = "%identity"
external int: int => element = "%identity"
external string: string => element = "%identity"
external promise: promise<element> => element = "%identity"

/* These are needed for Fragment (<> </>) support */
type fragmentProps = {children?: element}

@module("preact/jsx-runtime") external jsxFragment: component<fragmentProps> = "Fragment"

/* The Elements module is the equivalent to the ReactDOM module in Preact. This holds things relevant to _lowercase_ JSX elements. */
module Elements = {
  // Here you can control what props lowercase JSX elements should have.
  // A base that the React JSX transform uses is provided via JsxDOM.domProps,
  // but you can make this anything. The editor tooling will supportautocompletion etc for your specific type.

  type inputEventProps = {currentTarget: {files: array<WebAPI.FileTypes.file>, checked:bool}}

  type props = {
    ...JsxDOM.domProps,
    class?: string,
    @as("className")
    classSignal?: Signal.t<string>,
    @as("aria-has-popup")
    ariaHasPopup?: string,
    @as("aria-pressed")
    ariaPressedSignal?: Signal.t<bool>,
    @as("fill-opacity")
    fillOpacitySignal?: Signal.t<float>,
    @as("data-caption-id")
    dataCaptionId?: string,
    @as(`onInput`)
    onInputEvent?: inputEventProps=>unit,
    @as("checked")
    checkedAsSignal?: Signal.t<bool>,
  }

  @module("preact/jsx-runtime")
  external jsx: (string, props) => Jsx.element = "jsx"

  @module("preact/jsx-runtime")
  external div: (string, props) => Jsx.element = "jsx"

  @module("preact/jsx-runtime")
  external jsxKeyed: (string, props, ~key: string=?, @ignore unit) => Jsx.element = "jsx"

  @module("preact/jsx-runtime")
  external jsxs: (string, props) => Jsx.element = "jsxs"

  @module("preact/jsx-runtime")
  external jsxsKeyed: (string, props, ~key: string=?, @ignore unit) => Jsx.element = "jsxs"

  external someElement: element => option<element> = "%identity"
}

@module("preact")
external render: (element, WebAPI.DOMTypes.element) => unit = "render"
@module("preact")
external createPortal: (element, Null.t<WebAPI.DOMTypes.element>) => Jsx.element = "createPortal"

@module("preact/hooks")
external useMemo: (unit => 'val, array<_>) => 'val = "useMemo"

@module("preact/hooks")
external useCallback: ('arg => 'res, array<_>) => 'arg => 'res = "useCallback"

let get: string => 't = selector => document->WebAPI.Document.querySelector(selector)
