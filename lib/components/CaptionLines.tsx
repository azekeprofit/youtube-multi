import { useComputed, useSignal, useSignalEffect, type ReadonlySignal } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { captions } from "../hooks/useCaptions";
import { getKeys } from "../model/getKeys";
import { showCaps, srtContainer, trackContainer } from "../model/store";
import { getCaptionId, type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const ytLines = useComputed(() => captions.value.map(getCaptionId));
  return <Lines lines={ytLines} />
}

export function SrtLines() {
  const srtLines = useComputed(() => getKeys(srtContainer.value));
  return <Lines lines={srtLines} />
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
    return (show && track) ? Array.from(track.activeCues ?? []) : [];
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
    <For each={activeCues}>{(c: VTTCue) => <Cue key={c.id} cue={c} />}</For>
  </div>
}
