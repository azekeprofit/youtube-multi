type vssId = string
type videoId = string
type captionId = CaptionId(videoId, vssId) | SrtCaptionId(string)

let addTrackToCache = (captionId: captionId, track: WebAPI.WebVTTTypes.textTrack) => {
  let t = 1
}
