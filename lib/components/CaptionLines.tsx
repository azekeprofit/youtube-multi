import { useEffect } from "preact/hooks";
import { forceUpdate } from "../hooks/forceUpdate";
import { useCaptions } from "../hooks/useCaptions";
import { useShowCaps, useSrtKeys, useTracks } from "../model/store";
import { getCaptionId, type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const cpt = useCaptions().map(getCaptionId);
  return <Lines lines={cpt} />
}

export function SrtLines() {
  const srt = useSrtKeys();
  return <Lines lines={srt} />
}


function Lines({ lines }: { lines: captionId[] }) {
  return lines.map((cId) => <ActiveTrack key={cId} captionId={cId} />)
}

function ActiveTrack({ captionId }: { captionId: captionId }) {
  const track = useTracks((s) => s[captionId]);
  const update = forceUpdate();
  const show = useShowCaps((s) => s[captionId]);

  useEffect(() => {
    if (show && track) {
      track.addEventListener("cuechange", update);
      return () => track.removeEventListener("cuechange", update);
    }
  }, [captionId, track, show]);

  return (
    show && (
      <div class="captions-text">
        {Array.from(track?.activeCues ?? []).map((c: VTTCue) => (
          <Cue key={c.id} cue={c} />
        ))}
      </div>
    )
  );
}