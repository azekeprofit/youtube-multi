import { useComputed, useSignalEffect } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import { playerCaps, videoPlayer } from "../hooks/useCaptions";
import { loadSrtLine } from "../model/srtSubtitle";
import { pots, showCaps, trackContainer } from "../model/store";
import { addTrack, extractName, getCaptionIdFromVideoId, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
  const { vssId, kind, baseUrl, name, languageCode } = caption;
  const captionId = useComputed(() => getCaptionIdFromVideoId(playerCaps.value.player.id, caption));

  useSignalEffect(() => {
    const track = trackContainer.value[captionId.value];
    if (!track) {
      const newTrack = addTrack(captionId.value, vssId);
      return () => newTrack.mode = 'disabled';
    }
  })

  useSignalEffect(() => {
    const track = trackContainer.value[captionId.value];
    const showCap = showCaps.value[captionId.value];
    const pot = pots.value[playerCaps.value.player.id];
    if (!pot) videoPlayer.value.toggleSubtitlesOn();
    // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
    if (showCap && track?.cues?.length === 0 && pot) {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => loadSrtLine(track, captionId.value, xhr.responseText);
      xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
      xhr.responseType = "text";
      xhr.send();
    }
  })
  const autoCaption = kind == 'asr';
  const show = useComputed(() => autoCaption ? playerCaps.value.captions.length == 1 : true);

  return <Show when={show}>
    <CaptionCheckbox title={extractName(name)} label={`${languageCode}${autoCaption ? ' (auto)' : ''}`} captionId={captionId.value} />
  </Show>
}

export function YoutubeCaptionCheckboxes() {
  const caps = useComputed(() => playerCaps.value.captions);
  return <For each={caps}>{caption => <YtLangCheckbox key={caption.vssId} caption={caption} />}</For>
}
