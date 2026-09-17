let pop = (iter, fun) =>
  switch iter->Iterator.next {
  | {value: Some(Some(s))} => fun(s)
  | _ => None
  }

let str = i => pop(i, s => Some(s))
let float = i => pop(i, Float.fromString)
let int = i => pop(i, n => Int.fromString(n))
let time = i =>
  switch (i->float, i->float, i->float, i->float) {
  | (Some(hour), Some(minute), Some(second), Some(ms)) =>
    Some(hour * 60.0 * 60.0 + minute * 60.0 + second + ms / 1000.0)
  | _ => None
  }

let loadSrtLine = (track, capId, srtLines) => {
  let lineRegex = /(\d+)\r?\n(\d\d):(\d\d):(\d\d)\,(\d\d\d) --> (\d\d):(\d\d):(\d\d)\,(\d\d\d)\r?\n/
  let i = srtLines->String.splitByRegExp(lineRegex)->Array.values->Iterator.drop(1)

  while (
    switch (i->int, i->time, i->time, i->str) {
    | (Some(index), Some(start), Some(end), Some(text)) => {
        track->Captions.addCue(capId, start, end, text, index)
        true
      }
    | _ => false
    }
  ) {
    1->ignore
  }
}

let createTrack = (fileName, lines) =>
  switch Youtube.getVideoTag() {
  | Value(videoTag) => {
      let capId = Types.CaptionId(`srtFile.${fileName}`)
      let track = Store.addTrack(videoTag, capId, fileName)
      loadSrtLine(track, capId, lines)
      Store.setShowCap(capId, Boolean(true))
      Store.addSrtCaption(capId, fileName)
    }
  | _ => ()
  }

let loadSrtCaptions = (srtFilesObj: WebAPI.FileTypes.file) => {
  let fileReader = FileReader.make()
  fileReader.onload = e => createTrack(srtFilesObj.name, e.target.result)
  fileReader->FileReader.readAsText(srtFilesObj, ~encoding="UTF-8")
}
