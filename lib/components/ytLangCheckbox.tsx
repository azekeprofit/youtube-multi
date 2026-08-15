import { useComputed, useSignalEffect } from "@preact/signals";
import { useCaptions } from "../hooks/useCaptions";
import { loadSrtLine } from "../model/srtSubtitle";
import { pots, showCaps, trackContainer } from "../model/store";
import { addTrack, extractName, getCaptionId, getVideoId, getVideoPlayer, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
  const { vssId, kind, baseUrl, name, languageCode } = caption;
  const captionId = getCaptionId(caption);

  const track = useComputed(() => trackContainer.value[captionId]);
  const showCap = useComputed(() => showCaps.value[captionId]);
  useSignalEffect(() => {
    if (!track.value) {
      const newTrack = addTrack(captionId, vssId);
      return () => newTrack.mode = 'disabled';
    }
  })

  useSignalEffect(() => {
    const pot = pots.value[getVideoId()];
    if (!pot) getVideoPlayer().toggleSubtitlesOn();
    // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
    if (showCap.value && track.value?.cues?.length === 0 && pot) {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => loadSrtLine(track.value, captionId, xhr.responseText);
      xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
      xhr.responseType = "text";
      xhr.send();
    }
  })

  return <CaptionCheckbox showCap={showCap.value} track={track.value} title={extractName(name)} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}

export function YoutubeCaptionCheckboxes() {
  const capts = useCaptions();
  return capts.value.map(caption => <YtLangCheckbox key={caption.vssId} caption={caption} />)
}
