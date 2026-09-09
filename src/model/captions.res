module VTTCue = {
  @new external make: (float, float, string) => WebAPI.WebVTTTypes.textTrackCue = "VTTCue"
}

let addCue = (
  track: WebAPI.WebVTTTypes.textTrack,
  capId: Store.captionId,
  start: float,
  end: float,
  html: string,
  index: int,
) => {
  let cue = VTTCue.make(start, end, html)
  cue.id = `${capId->Store.captionIdToString}.${index->Int.toString}`
  track->WebAPI.TextTrack.addCue(cue)
}
