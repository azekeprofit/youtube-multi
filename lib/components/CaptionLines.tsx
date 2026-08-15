import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useCaptions } from "../hooks/useCaptions";
import { getKeys } from "../model/getKeys";
import { showCaps, srtContainer, trackContainer } from "../model/store";
import { getCaptionId, type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const cpt = useCaptions();
  return <Lines lines={cpt.value.map(getCaptionId)} />
}

export function SrtLines() {
  const srtLines = useComputed(() => getKeys(srtContainer.value));
  return <Lines lines={srtLines.value} />
}


function Lines({ lines }: { lines: captionId[] }) {
  return lines.map((cId) => <ActiveTrack key={cId} captionId={cId} />)
}

function ActiveTrack({ captionId }: { captionId: captionId }) {
  const track = useComputed(() => trackContainer.value[captionId]);
  const update = useSignal(0);
  const show = useComputed(() => showCaps.value[captionId]);

  useSignalEffect(() => {
    if (show.value && track.value) {
      function forceUpdate() { update.value++; }
      track.value.addEventListener("cuechange", forceUpdate);
      return () => track.value.removeEventListener("cuechange", forceUpdate);
    }
  });

  return (
    show.value && (
      <div class="captions-text">
        {Array.from(track.value?.activeCues ?? []).map((c: VTTCue) => (
          <Cue key={c.id} cue={c} />
        ))}
      </div>
    )
  );
}
