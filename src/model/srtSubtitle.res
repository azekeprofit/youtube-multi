let loadSrtLine = (
  track: WebAPI.WebVTTTypes.textTrack,
  capId: Store.captionId,
  srtLines: string,
) => {
  let t = 1
  //   const lineRegex =
  //     /(\d+)\r?\n(\d\d):(\d\d):(\d\d)\,(\d\d\d) --> (\d\d):(\d\d):(\d\d)\,(\d\d\d)\r?\n/;
  //   const arr = srtLines.split(lineRegex);
  //   let i=0;
  //   const popStr = ()=>arr[i++];
  //   const pop = () => parseFloat(popStr());
  //   pop();
  //   const popTime = () =>
  //     pop() * 60 * 60 + pop() * 60 + (pop() - 0) + pop() / 1000;
  //   while (true) {
  //     const index = pop();
  //     if (isNaN(index)) break;
  //     addCue(track, capId, popTime(), popTime(), popStr(), index);
  //   }
}

let createTrack = (fileName: string, lines: string) =>
  switch Youtube.getVideoTag() {
  | Value(videoTag) => {
      let capId = Store.SrtCaptionId(fileName)
      let track = Youtube.addTrack(videoTag, capId, fileName)
      loadSrtLine(track, capId, lines)
      //   setShowCap(capId, true);
      //   addSrtCaption(capId, fileName);
    }
  | _ => ()
  }

let loadSrtCaptions = (srtFilesObj: WebAPI.FileTypes.file) => {
  let fileReader = FileReader.make()
  fileReader.onload = e => createTrack(srtFilesObj.name, e.target.result)
  fileReader->FileReader.readAsText(srtFilesObj, ~encoding="UTF-8")
}
