let potsContainer = Signal.make(dict{})

type potEventDetails = {
  details: {
    videoId: Types.videoId,
    pot: string,
  },
}
let addPot = ({details: {videoId, pot}}) =>
  switch videoId {
  | VideoId(v) if !(potsContainer.value->Dict.has(v)) => potsContainer->Store.update(v, pot)
  | _ => ()
  }
