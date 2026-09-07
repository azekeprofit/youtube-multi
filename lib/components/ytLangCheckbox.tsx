import { useSignalEffect } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { playerCaptions, videoPlayer, videoUrlId, type videoPlayerCaptions } from "../model/captions";
import { loadSrtLine } from "../model/srtSubtitle";
import { pots, showCaps, trackContainer } from "../model/store";
import { addCue, addTrack, extractName } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox({ caption: { track: { vssId, kind, baseUrl, name, languageCode },
  captionId } }: { caption: videoPlayerCaptions }) {

  useSignalEffect(() => {
    const track = trackContainer.peek()[captionId] ?? addTrack(captionId, vssId);

    const showCap = showCaps.value[captionId];
    const pot = pots.value[videoUrlId.value];

    if (!pot) videoPlayer.value.toggleSubtitlesOn();
    // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
    if (showCap && track?.cues?.length === 0 && pot) {
      // add stub cue
      addCue(track, captionId, -1, -1, '', -1);
      const xhr = new XMLHttpRequest();
      xhr.onload = () => loadSrtLine(track, captionId, xhr.responseText);
      xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
      xhr.responseType = "text";
      xhr.send();
    }
  })

  const autoCaption = kind == 'asr';

  return <CaptionCheckbox title={extractName(name)} label={`${languageCode}${autoCaption ? ' (auto)' : ''}`} captionId={captionId} />
}

export function YoutubeCaptionCheckboxes() {
  return <For each={playerCaptions} getKey={c => c.captionId}>{caption => <YtLangCheckbox caption={caption} />}</For>
}
