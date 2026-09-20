@jsx.component
let make = _ => {
  let scrollDiv = Preact.useRef(None) // None :> option<WebAPI.DOMTypes.htmlDivElement>
  let intervalRef = Preact.useRef(0)
  let showLeft = Signal.useSignal(false)
  let showRight = Signal.useSignal(false)

  let resetArrows = (scroll: WebAPI.DOMTypes.htmlDivElement) => {
    showLeft.value = scroll.scrollLeft != 0.0
    showRight.value =
      scroll.scrollLeft < Float.fromInt(scroll.scrollWidth - scroll.clientWidth - 15)
  }

  let mouseUp = _ => {
    if intervalRef.current != 0 {
      WebAPI.Window.clearInterval(window, intervalRef.current)
      intervalRef.current = 0
    }
  }

  let mouseHold = step =>
    Preact.Elements.props({
      onMouseDown: _ =>
        if intervalRef.current == 0 {
          intervalRef.current = WebAPI.Window.setInterval2(
            window,
            ~handler=_ =>
              {
                let? Some(scroll) = scrollDiv.current
                scroll->WebAPI.HTMLDivElement.scrollBy2(~x=step, ~y=0.0)
                resetArrows(scroll)
                None
              }->ignore,
            ~timeout=100,
          )
        },
      onMouseUp: mouseUp,
      onMouseLeave: mouseUp,
    })

  Signal.useSignalEffect(() => {
    let? Some(scroll) = scrollDiv.current
    Store.srtContainer->Signal.track // subscribe to srtContainer changes, so arrow will apropriately appear when a new SRT-caption was added
    WebAPI.Window.setTimeout(window, ~handler=_ => resetArrows(scroll), ~timeout=100)->ignore // pause to give component some time to render checkboxes
    resetArrows(scroll) // so i don't have to create another useEffect just for initial render
    None
  })

  <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <Arrow text="🠜" show={showLeft} direction={#left} attr={mouseHold(-15.0)} />
      <div class="scroll" ref={scrollDiv->Preact.domRef}>
        <Signal.for_ each={Captions.playerCaptions} getKey={c => c.captionId->Types.asKey}>
          {({track, captionId}, _) => <YtLangCheckbox track captionId />}
        </Signal.for_>
        <Signal.for_ each={Store.srtKeys} getKey={Types.identity}>
          {(key, _) => <SrtCheckbox captionId={Types.CaptionId(key)} />}
        </Signal.for_>
      </div>
      <Arrow text="🠞" show={showRight} direction={#right} attr={mouseHold(15.0)} />
    </div>
  </div>
}
