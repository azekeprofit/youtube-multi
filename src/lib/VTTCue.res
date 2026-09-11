type t = {
  text: string,
  ...WebAPI.WebVTTTypes.textTrackCue,
}

@new external make: (float, float, string) => t = "VTTCue"
external asTrack: t => WebAPI.WebVTTTypes.textTrackCue = "%identity"
