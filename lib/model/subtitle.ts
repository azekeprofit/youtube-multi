import { addCue, type captionId } from "./youtube";

export function loadYoutubeCaptions(
  capId: captionId,
  track: TextTrack,
  doc: Document
) {
  // add stub cue
  addCue(track, capId, -1, -1, '', -1);
  let prevCue: VTTCue = null;
  doc.querySelectorAll<HTMLElement>("text")
    .forEach((l, index) => {
      const start = parseFloat(l.getAttribute("start"));
      if (prevCue != null) {
        if (prevCue.startTime == prevCue.endTime) prevCue.endTime = start;
      }
      const cue = addCue(
        track,
        capId,
        start,
        parseFloat(l.getAttribute("dur") ?? "0") + start,
        l.textContent,
        index
      );
      if (cue) prevCue = cue;
    });
}
