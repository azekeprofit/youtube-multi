type potEventDetails = {
  details: {
    videoId: Types.videoId,
    pot: string,
  },
}
let potsContainer = Signal.make(dict{})

let addPot = ({details: {videoId, pot}}) =>
  switch videoId {
  | Types.VideoId(v) =>
    if !(potsContainer.value->Dict.has(v)) {
      potsContainer->Store.update(v, pot)
    }
  | _ => ()
  }
