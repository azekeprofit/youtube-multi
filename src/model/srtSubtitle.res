let loadSrtLine = (
  track: WebAPI.WebVTTTypes.textTrack,
  capId: Captions.captionId,
  srtLines: string,
) => {
  let lineRegex = /(\d+)\r?\n(\d\d):(\d\d):(\d\d)\,(\d\d\d) --> (\d\d):(\d\d):(\d\d)\,(\d\d\d)\r?\n/
  let arr = srtLines->String.splitByRegExp(lineRegex)
  let i = ref(1)
  let step = () => {
    i := i.contents + 1
    i.contents
  }
  let popStr = () =>
    switch arr[step()] {
    | Some(Some(s)) => s
    | _ => ``
    }
  let pop = () => Float.fromString(popStr())
  let popTime = () =>
    switch (pop(), pop(), pop(), pop()) {
    | (Some(hour), Some(minute), Some(second), Some(ms)) =>
      Some(hour * 60.0 * 60.0 + minute * 60.0 + second + ms / 1000.0)
    | _ => None
    }
  while (
    switch Int.fromString(popStr()) {
    | Some(index) =>
      switch (popTime(), popTime()) {
      | (Some(start), Some(end)) => {
          track->Captions.addCue(capId, start, end, popStr(), index)
          true
        }
      | _ => false
      }
    | _ => false
    }
  ) {
    let _ = 1
  }
}

let createTrack = (fileName: string, lines: string) =>
  switch Youtube.getVideoTag() {
  | Value(videoTag) => {
      let capId = Captions.CaptionId(`srtFile.${fileName}`)
      let track = Youtube.addTrack(videoTag, capId, fileName)
      loadSrtLine(track, capId, lines)
      //   setShowCap(capId, true);
      Store.addSrtCaption(capId, fileName)
    }
  | _ => ()
  }

let loadSrtCaptions = (srtFilesObj: WebAPI.FileTypes.file) => {
  let fileReader = FileReader.make()
  fileReader.onload = e => createTrack(srtFilesObj.name, e.target.result)
  fileReader->FileReader.readAsText(srtFilesObj, ~encoding="UTF-8")
}
