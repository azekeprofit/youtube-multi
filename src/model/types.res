@unboxed type vssId = VssId(string)
@unboxed type captionId = CaptionId(string)
@unboxed type videoId = VideoId(string)


let getCaptionId = (videoId, VssId(vssId)) => CaptionId(
  switch videoId {
  | Some(VideoId(v)) => `${v}.${vssId}`
  | _ => ``
  },
)
let asKey = (CaptionId(key)) => key



// cleanups for effects
@unboxed type cleanup = Cleanup(unit => unit) | @as(undefined) None
