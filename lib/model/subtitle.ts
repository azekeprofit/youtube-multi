import { addCue, type captionId } from "./youtube";

export function loadYoutubeCaptions(
  capId: captionId,
  track: TextTrack,
  text: string
) {
  let prevCue: VTTCue = null;
  new DOMParser()
    .parseFromString(text.replace(/&amp;/g, "&"), "text/xml")
    .querySelectorAll<HTMLElement>("text")
    .forEach((l, index) => {
      const start = parseInt(l.getAttribute("start") ?? "");
      if (prevCue != null) {
        if (prevCue.startTime == prevCue.endTime) prevCue.endTime = start;
      }
      const cue = addCue(
        track,
        capId,
        start,
        parseInt(l.getAttribute("dur") ?? "") + start,
        l.innerHTML.trim(),
        index
      );
      if (cue) prevCue = cue;
    });
}
