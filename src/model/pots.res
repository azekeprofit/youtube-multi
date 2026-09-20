let potsContainer = Signal.make(dict{})

type potEventDetails = {
  detail: {
    videoId: Types.videoId,
    pot: string,
  },
}
let addPot = ({detail: {videoId, pot}}) =>
  switch videoId {
  | VideoId(v) if !(potsContainer.value->Dict.has(v)) => potsContainer->Store.update(v, pot)
  | _ => ()
  }
