let getCues = captionId =>
  switch Store.trackContainer.value->Dict.get(captionId->Types.asKey) {
  | Some({activeCues: Value(t)}) => t->VTTCue.cueListToArray
  | _ => []
  }

@jsx.component
let make = (~captionId) => {
  let activeCues = Signal.useSignal(getCues(captionId))
  let key = captionId->Types.asKey
  let show = Signal.useComputed(_ => captionId->Store.getShowCap)

  Signal.useSignalEffect(_ => {
    let? Some(track) = Store.trackContainer.value->Dict.get(key)
    let forceUpdate = _ => activeCues.value = getCues(captionId)
    track->WebAPI.TextTrack.addEventListener(Custom("cuechange"), forceUpdate)
    Some(_ => track->WebAPI.TextTrack.removeEventListener(Custom("cuechange"), forceUpdate))
  })

  <Signal.show when_={show}>
    <div class="captions-text" dataCaptionId={key}>
      <Signal.for_ each={activeCues}> {(cue, _) => <Cue key={cue.id} cue />} </Signal.for_>
    </div>
  </Signal.show>
}
