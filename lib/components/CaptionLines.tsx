import { useComputed, useSignal, useSignalEffect, type ReadonlySignal } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { playerCaptions, videoUrlId } from "../hooks/useCaptions";
import { getKeys } from "../model/getKeys";
import { showCaps, srtContainer, trackContainer } from "../model/store";
import { getCaptionIdFromVideoId, type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const ytLines = useComputed(() => playerCaptions.value.captions.map(c => getCaptionIdFromVideoId(videoUrlId.value, c)));
  const srtLines = useComputed(() => getKeys(srtContainer.value));
  return <div id='youtube-multi-caption-container' class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
    <Lines lines={ytLines} />
    <Lines lines={srtLines} />
  </div>
}

function Lines({ lines }: { lines: ReadonlySignal<captionId[]> }) {
  return <For each={lines}>{(cId: captionId) => <ActiveTrack key={cId} captionId={cId} />}</For>
}

function ActiveTrack({ captionId }: { captionId: captionId }) {
  const update = useSignal(0);
  const activeCues = useComputed(() => {
    update.value;
    const track = trackContainer.value[captionId];
    const show = showCaps.value[captionId];
    return show ? Array.from(track?.activeCues ?? []) : [];
  });

  useSignalEffect(() => {
    const track = trackContainer.value[captionId];

    if (track) {
      const forceUpdate = () => update.value++;
      track.addEventListener("cuechange", forceUpdate);
      return () => track.removeEventListener("cuechange", forceUpdate);
    }
  });

  return <div class="captions-text">
    <For each={activeCues} getKey={c => c.id}>{(c: VTTCue) => <Cue key={c.id} cue={c} />}</For>
  </div>
}
