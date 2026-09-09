type vssId = string
@unboxed type videoId = VideoId(string) | None
type captionId = CaptionId(videoId, vssId) | SrtCaptionId(string)

let addTrackToCache = (captionId: captionId, track: WebAPI.WebVTTTypes.textTrack) => {
  let t = 1
}
