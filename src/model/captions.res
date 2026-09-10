type vssId = string
@unboxed type videoId = VideoId(string)
@unboxed type captionId = CaptionId(string)
let captionIdToString = (CaptionId(c)) => c
let getCaptionId = (VideoId(videoId), vssId: vssId) => `${videoId}.${vssId}`

module VTTCue = {
  @new external make: (float, float, string) => WebAPI.WebVTTTypes.textTrackCue = "VTTCue"
}

let addCue = (
  track: WebAPI.WebVTTTypes.textTrack,
  CaptionId(capId),
  start: float,
  end: float,
  html: string,
  index: int,
) => {
  let cue = VTTCue.make(start, end, html)
  cue.id = `${capId}.${index->Int.toString}`
  track->WebAPI.TextTrack.addCue(cue)
}
