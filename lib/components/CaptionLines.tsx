import { useAtomValue } from "jotai";
import { useEffect } from "preact/hooks";
import { useShallow } from "zustand/react/shallow";
import { forceUpdate } from "../hooks/forceUpdate";
import { useCaptions } from "../hooks/useCaptions";
import { getKeys } from "../model/getKeys";
import { trackFam, useShowCaps, useSrt } from "../model/store";
import { getCaptionId, type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const cpt = useCaptions().map(getCaptionId);
  const srt = useSrt(useShallow((s) => getKeys(s.srtCaptions)));

  return (
    <div class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
      {cpt.map((cId) => (
        <ActiveTrack key={cId} captionId={cId} />
      ))}
      {srt.map((cId) => (
        <ActiveTrack key={cId} captionId={cId} />
      ))}
    </div>
  );
}

function ActiveTrack({ captionId }: { captionId: captionId }) {
  const track = useAtomValue(trackFam(captionId));
  const update = forceUpdate();
  const show = useShowCaps((s) => s.showCap[captionId]);

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