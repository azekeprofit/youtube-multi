type vssId = string
@unboxed type videoId = VideoId(string) | None
type captionId = CaptionId(videoId, vssId) | SrtCaptionId(string)
let captionIdToString = (captionId: captionId) =>
  switch captionId {
  | CaptionId(videoId, vssId) =>
    switch videoId {
    | VideoId(v) => `(${v}, ${vssId})`
    | None => ``
    }
  | SrtCaptionId(fileName) => fileName
  }

let addTrackToCache = (captionId: captionId, track: WebAPI.WebVTTTypes.textTrack) => {
  let t = 1
}
