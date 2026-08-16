import { useSignalEffect } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { captions, videoPlayer } from "../hooks/useCaptions";
import { loadSrtLine } from "../model/srtSubtitle";
import { pots, showCaps, trackContainer } from "../model/store";
import { addTrack, extractName, getCaptionId, getVideoId, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
  const { vssId, kind, baseUrl, name, languageCode } = caption;
  const captionId = getCaptionId(caption);

  useSignalEffect(() => {
    const track = trackContainer.value[captionId];
    if (!track) {
      const newTrack = addTrack(captionId, vssId);
      return () => newTrack.mode = 'disabled';
    }
  })

  useSignalEffect(() => {
    const track = trackContainer.value[captionId];
    const showCap = showCaps.value[captionId];
    const pot = pots.value[getVideoId()];
    if (!pot) videoPlayer.value.toggleSubtitlesOn();
    // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
    if (showCap && track?.cues?.length === 0 && pot) {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => loadSrtLine(track, captionId, xhr.responseText);
      xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
      xhr.responseType = "text";
      xhr.send();
    }
  })

  return <CaptionCheckbox title={extractName(name)} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}

export function YoutubeCaptionCheckboxes() {
  return <For each={captions}>{caption => <YtLangCheckbox key={caption.vssId} caption={caption} />}</For>
}
