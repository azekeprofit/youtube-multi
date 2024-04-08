import { type line } from "./subtitle";

export function loadSrtCaptions(srtFilesObj: File) {
  return new Promise<line[]>((succ, fail) => {
    var fileReader = new FileReader();
    fileReader.onload = (e) => succ(load(e.target.result as string));
    fileReader.readAsText(srtFilesObj, "UTF-8");
  });
}

function load(srtLines: string) {
  let lines: line[] = [];
  const lineRegex =
    /(\d+)\r?\n(\d\d):(\d\d):(\d\d)\,(\d\d\d) --> (\d\d):(\d\d):(\d\d)\,(\d\d\d)\r?\n/;

  const arr = srtLines.split(lineRegex);
  const popStr = () => arr.splice(0, 1)[0];
  const pop = () => parseFloat(popStr());
  pop();
  const popTime = () =>
    pop() * 60 * 60 + pop() * 60 + (pop() - 0) + pop() / 1000;

  while (true) {
    const index = pop();
    if (isNaN(index)) break;
    lines.push({ start: popTime(), end: popTime(), html: popStr() });
  }

  return lines;
}
