type t = {
  text: string,
  ...WebAPI.WebVTTTypes.textTrackCue,
}

@new external make: (float, float, string) => t = "VTTCue"
external asTrack: t => WebAPI.WebVTTTypes.textTrackCue = "%identity"

@send external cueListLength: WebAPI.WebVTTTypes.textTrackCueList => int = "length"
external cueListToArray: WebAPI.WebVTTTypes.textTrackCueList => array<t> = "Array.from"
