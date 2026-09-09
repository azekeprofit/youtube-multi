type fileReaderState = | @as(`EMPTY`) Empty | @as(`LOADING`) Loading | @as(`DONE`) Done
type onloadArgument={target:{result:string}}
type t = {
  readyState: fileReaderState,
  mutable onload: onloadArgument=>unit
  // error: WebAPI.Prelude.DOMException.t,
}
@new external make: unit => t = "FileReader"

@send external readAsText: (t, WebAPI.FileTypes.file, ~encoding: string=?) => unit = "readAsText"
