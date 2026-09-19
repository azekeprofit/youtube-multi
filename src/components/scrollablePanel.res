module Arrow = {
  type direction = [#left | #right]
  external directionToString: direction => string = "%identity"
  @jsx.component
  let make = (~show: Signal.t<bool>, ~text, ~direction, ~attr) =>
    <span
      {...attr}
      classAsSignal={Signalish.fromSignal(
        Signal.useComputed(() =>
          `arrow ${direction->directionToString} ${show.value ? "show" : ""}`
        ),
      )}
    >
      {text->Preact.string}
    </span>
}

@jsx.component
let make = () => {
  let scrollDiv = Preact.useRef((None :> option<WebAPI.DOMTypes.htmlDivElement>))
  let intervalRef = Preact.useRef(0)
  let showLeft = Signal.useSignal(false)
  let showRight = Signal.useSignal(false)

  let doScroll = Preact.useCallback(() =>
    switch scrollDiv.current {
    | Some(scroll) => {
        showLeft.value = scroll.scrollLeft != 0.0
        showRight.value =
          scroll.scrollLeft < Float.fromInt(scroll.scrollWidth - scroll.clientWidth - 15)
      }
    | _ => ()
    }
  , [])

  let mouseHold = Preact.useCallback(step => {
    let mouseUp = _ => {
      if intervalRef.current != 0 {
        WebAPI.Window.clearInterval(window, intervalRef.current)
        intervalRef.current = 0
      }
    }

    Preact.Elements.props({
      onMouseDown: _ =>
        if intervalRef.current == 0 {
          intervalRef.current = WebAPI.Window.setInterval2(
            window,
            ~handler=() => {
              switch scrollDiv.current {
              | Some(scroll) => scroll->WebAPI.HTMLDivElement.scrollBy2(~x=step, ~y=0.0)
              | _ => ()
              }
              doScroll()
            },
            ~timeout=100,
          )
        },
      onMouseUp: mouseUp,
      onMouseLeave: mouseUp,
    })
  }, [])

  Signal.useSignalEffect(() => {
    Store.srtContainer->Signal.track // subscribe to srtContainer changes, so arrow will apropriately appear when a new SRT-caption was added
    WebAPI.Window.setTimeout(window, ~handler=doScroll, ~timeout=100)->ignore // pause to give component some time to render checkboxes
    doScroll() // so i don't have to create another useEffect just for initial render
    None
  })

  <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <Arrow text="🠜" show={showLeft} direction={#left} attr={mouseHold(-15.0)} />
      <div class="scroll" ref={scrollDiv->Preact.domRef}>
        <YoutubeCaptionCheckboxes />
        <SrtCheckboxes />
      </div>
      <Arrow text="🠞" show={showRight} direction={#right} attr={mouseHold(15.0)} />
    </div>
  </div>
}
