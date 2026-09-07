import { useComputed, useSignal, useSignalEffect, type ReadonlySignal } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { playerCaptions } from "../model/captions";
import { showCaps, srtKeys, trackContainer } from "../model/store";
import { type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const ytLines = useComputed(() => playerCaptions.value.map(({captionId}) => captionId));
  return <div id='youtube-multi-caption-container' class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
    <Lines lines={ytLines} />
    <Lines lines={srtKeys} />
  </div>
}

function Lines({ lines }: { lines: ReadonlySignal<captionId[]> }) {
  return <For each={lines}>{(cId: captionId) => <ActiveTrack captionId={cId} />}</For>
}

function getCues(captionId: captionId) {
  const track = trackContainer.value[captionId];
  const show = showCaps.value[captionId];
  return show ? Array.from(track?.activeCues ?? []) : [];
}
function ActiveTrack({ captionId }: { captionId: captionId }) {
  const activeCues = useSignal(getCues(captionId));

  useSignalEffect(() => {
    const track = trackContainer.value[captionId];

    if (track) {
      const forceUpdate = () => activeCues.value = getCues(captionId);
      track.addEventListener("cuechange", forceUpdate);
      return () => track.removeEventListener("cuechange", forceUpdate);
    }
  });

  return <div class="captions-text">
    <For each={activeCues} getKey={c => c.id}>{(c: VTTCue) => <Cue cue={c} />}</For>
  </div>
}
