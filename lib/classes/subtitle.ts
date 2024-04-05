export interface line {
  start:number;
  end:number;
  html: string;
}

export function createTrack(code:string, lines:line[]) {
  const videoTag=document.querySelector('video') as HTMLVideoElement;
  let track=videoTag.addTextTrack("captions", code, code);

  function rounded(rTime){
    return Math.round(rTime*10)/10;
  }

  lines.forEach(({ start, end }, index) => {
    for(let rStart=rounded(start);rStart<rounded(end);rStart=rounded(rStart+.1))
    track.addCue(new VTTCue(rStart, rStart+.1, lines[index].html));
  });
  track.mode='showing';
  return track;
}

export function loadYoutubeCaptions(languageCode: string, text: string) {
  let lines: line[] = [];
  new DOMParser()
    .parseFromString(text.replace(/&amp;/g, "&"), "text/xml")
    .querySelectorAll<HTMLElement>("text")
    .forEach((l) => {
      const start = parseInt(l.getAttribute("start") ?? "");
      if (lines.length) {
        const prevSub = lines[lines.length - 1];
        if (prevSub.start == prevSub.end) prevSub.end = start;
      }
      if (l.innerHTML.trim().length)
        lines.push({
          start,
          end: parseInt(l.getAttribute("dur") ?? "") + start,
          html: l.innerHTML,
        });
    });

  return createTrack(languageCode, lines);
}