import Markup from "preact-markup";
import { useEffect, useMemo } from "preact/hooks";
import { forceUpdate } from "../hooks/forceUpdate";
import { useCaptions } from "../hooks/useCaptions";
import { useShowCaps, useSrt, useTracks } from "../model/store";
import { getCaptionId, type captionId } from "../model/youtube";

export function CaptionLines() {
  const cpt = useCaptions().map(getCaptionId);
  const srt = useSrt((s) => Object.keys(s.srtCaptions));

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
  const track = useTracks((s) => s.cache[captionId]);
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

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

const components = { i: ({ children }) => <> <i>{children}</i></> };

function Cue({ cue: { text } }: { cue: VTTCue }) {
  const parsed = useMemo(() => htmlDecode(text), [text]);

  return (
    parsed && (
      <div class="caption-visual-line">
        <div class="bg">
          <div class="ytp-caption-segment">
            <Markup markup={parsed} type="html" components={components} />
          </div>
        </div>
      </div>
    )
  );
}
