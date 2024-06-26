import { addSrtCaption, setShowCap } from "./store";
import { addCue, addTrack, type captionId } from "./youtube";

export function loadSrtCaptions(srtFilesObj: File) {
  var fileReader = new FileReader();
  fileReader.onload = (e) =>
    createTrack(srtFilesObj.name, e.target.result as string);
  fileReader.readAsText(srtFilesObj, "UTF-8");
}

function createTrack(fileName: string, lines: string) {
  const capId = "srtFile." + fileName;
  const track = addTrack(capId, fileName);
  loadSrtLine(track, capId, lines);
  setShowCap(capId, true);
  addSrtCaption(capId, fileName);
}

function loadSrtLine(track: TextTrack, capId: captionId, srtLines: string) {
  const lineRegex =
    /(\d+)\r?\n(\d\d):(\d\d):(\d\d)\,(\d\d\d) --> (\d\d):(\d\d):(\d\d)\,(\d\d\d)\r?\n/;

  const arr = srtLines.split(lineRegex);
  let i=0;
  const popStr = ()=>arr[i++];
  const pop = () => parseFloat(popStr());
  pop();
  const popTime = () =>
    pop() * 60 * 60 + pop() * 60 + (pop() - 0) + pop() / 1000;

  while (true) {
    const index = pop();
    if (isNaN(index)) break;
    addCue(track, capId, popTime(), popTime(), popStr(), index);
  }
}
