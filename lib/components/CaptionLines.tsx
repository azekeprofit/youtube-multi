import { useComputed, useSignal, useSignalEffect, type ReadonlySignal } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import { playerCaptions } from "../model/captions";
import { showCaps, srtKeys, trackContainer } from "../model/store";
import { type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const ytLines = useComputed(() => playerCaptions.value.map(({ captionId }) => captionId));
  return <div id='youtube-multi-caption-container' class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
    <Lines lines={ytLines} />
    <Lines lines={srtKeys} />
  </div>
}

function Lines({ lines }: { lines: ReadonlySignal<captionId[]> }) {
  return <For each={lines}>{(cId: captionId) => <ActiveTrack key={cId} captionId={cId} />}</For>
}

function getCues(captionId: captionId) {
  const track = trackContainer.value[captionId];
  return Array.from(track?.activeCues ?? []);
}
function ActiveTrack({ captionId }: { captionId: captionId }) {
  const activeCues = useSignal(getCues(captionId));
  const show = useComputed(() => showCaps.value[captionId]);

  useSignalEffect(() => {
    const track = trackContainer.value[captionId];

    if (track) {
      const forceUpdate = () => activeCues.value = getCues(captionId);
      track.addEventListener("cuechange", forceUpdate);
      return () => track.removeEventListener("cuechange", forceUpdate);
    }
  });

  return <Show when={show}>
    <div class="captions-text" data-caption-id={captionId}>
      <For each={activeCues}>{(c: VTTCue) => <Cue key={c.id} cue={c} />}</For>
    </div>
  </Show>
}
