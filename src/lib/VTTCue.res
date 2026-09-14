type t = {
  text: string,
  ...WebAPI.WebVTTTypes.textTrackCue,
}

@new external make: (float, float, string) => t = "VTTCue"
external asTrack: t => WebAPI.WebVTTTypes.textTrackCue = "%identity"

external cueListToArray: WebAPI.WebVTTTypes.textTrackCueList => array<t> = "Array.from"
