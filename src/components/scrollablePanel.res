let useComputed = Signal.useComputed
let useSignalRef = Signal.useSignalRef
let useSignal = Signal.useSignal
let useCallback = Preact.useCallback

module Arrow = {
  type direction = Left | Right
  let directionToString = d =>
    switch d {
    | Left => "left"
    | Right => "right"
    }
  @jsx.component
  let make = (~show: Signal.t<bool>, ~text, ~direction, ~attr) =>
    <span
      {...attr}
      classSignal={useComputed(() =>
        `arrow ${direction->directionToString} ${show.value ? "show" : ""}`
      )}
    >
      {text->Preact.string}
    </span>
}

open Preact.Elements
@unboxed type scrollDivType = | @as(null) None | ScrollDiv(WebAPI.DOMTypes.htmlDivElement)
@jsx.component
let make = () => {
  let scrollDiv = useSignalRef(None)
  let intervalRef = useSignalRef(0)
  let showLeft = useSignal(false)
  let showRight = useSignal(false)

  let doScroll = useCallback(() =>
    switch scrollDiv.current {
    | ScrollDiv(scroll) => {
        showLeft.value = scroll.scrollLeft != 0.0
        showRight.value =
          scroll.scrollLeft < Float.fromInt(scroll.scrollWidth - scroll.clientWidth - 15)
      }
    | _ => ()
    }
  , [])

  let mouseHold = useCallback(step => {
    let mouseUp = _ => {
      if intervalRef.current != 0 {
        WebAPI.Window.clearInterval(window, intervalRef.current)
        intervalRef.current = 0
      }
    }

    {
      onMouseDown: _ =>
        if intervalRef.current != 0 {
          intervalRef.current = WebAPI.Window.setInterval2(
            window,
            ~handler=() => {
              switch scrollDiv.current {
              | ScrollDiv(scroll) => scroll->WebAPI.HTMLDivElement.scrollBy2(~x=step, ~y=0.0)
              | _ => ()
              }
              doScroll()
            },
            ~timeout=100,
          )
        },
      onMouseUp: mouseUp,
      onMouseLeave: mouseUp,
    }
  }, [])

  Signal.useSignalEffect(() => {
    Store.srtContainer->Signal.track // subscribe to srtContainer changes, so arrow will apropriately appear when a new SRT-caption was added
    WebAPI.Window.setTimeout(window, ~handler=doScroll, ~timeout=100)->ignore // pause to give component some time to render checkboxes
    doScroll() // so i don't have to create another useEffect just for initial render
    None
  })

  <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <Arrow text="🠜" show={showLeft} direction={Left} attr={mouseHold(-15.0)} />
      <div class="scroll" ref={scrollDiv->Signal.callbackDomRef}>
        //   <YoutubeCaptionCheckboxes />
        //   <SrtCheckboxes />
      </div>
      <Arrow text="🠞" show={showRight} direction={Right} attr={mouseHold(15.0)} />
    </div>
  </div>
}
