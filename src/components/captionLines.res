let getCues = captionId =>
  switch Store.trackContainer.value->Dict.get(captionId->Types.asKey) {
  | Some({activeCues: Value(t)}) => t->VTTCue.cueListToArray
  | _ => []
  }

module ActiveTrack = {
  @jsx.component
  let make = (~captionId) => {
    let activeCues = Signal.useSignal(getCues(captionId))
    let key = captionId->Types.asKey
    let show = Signal.useComputed(() => captionId->Store.getShowCap)

    Signal.useSignalEffect(() =>
      switch Store.trackContainer.value->Dict.get(key) {
      | Some(track) => {
          let forceUpdate = _ => activeCues.value = getCues(captionId)
          track->WebAPI.TextTrack.addEventListener(Custom("cuechange"), forceUpdate)
          Cleanup(
            () => track->WebAPI.TextTrack.removeEventListener(Custom("cuechange"), forceUpdate),
          )
        }
      | _ => None
      }
    )

    <Signal.show when_={show}>
      <div class="captions-text" dataCaptionId={key}>
        <Signal.for_ each={activeCues}> {(cue, _) => <Cue key={cue.id} cue />} </Signal.for_>
      </div>
    </Signal.show>
  }
}

module Lines = {
  @jsx.component
  let make = (~lines) =>
    <Signal.for_ each={lines}>
      {(key, _) => <ActiveTrack key captionId={CaptionId(key)} />}
    </Signal.for_>
}

@jsx.component
let make = () => {
  let ytLines = Signal.useComputed(() =>
    Captions.playerCaptions.value->Array.map(({captionId}) => captionId->Types.asKey)
  )
  <div
    id="youtube-multi-caption-container"
    class="caption-window ytp-caption-window-bottom youtube-multi-bottom"
  >
    <Lines lines={ytLines} />
    <Lines lines={Store.srtKeys} />
  </div>
}
