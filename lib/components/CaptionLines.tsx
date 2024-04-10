import { useEffect } from "preact/hooks";
import { useSrt, useShowCaps, useTracks } from "../model/store";
import { getCaptionId } from "../model/youtube";
import { forceUpdate } from "../hooks/forceUpdate";
import { useCaptions } from "../hooks/useCaptions";

export function CaptionLines() {
    const capts = useCaptions().map(getCaptionId);
    const srtCaps = useSrt(s => s.srtCaptions);
    const activeTracks = useShowCaps(s => (capts.concat(Object.keys(srtCaps))).filter(c => s.showCap[c]));
    const trackCache = useTracks(s => s.cache);
    const update = forceUpdate();

    useEffect(() => {
        const timer = setInterval(update, 500);
        return () => clearInterval(timer);
    }, [])

    return <div class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
        {activeTracks.map(cId =>
            <div class="captions-text" key={cId}>
                {Array.from(trackCache[cId]?.activeCues ?? []).map((c: VTTCue) => <Cue key={c.id} cue={c} />)}
            </div>
        )}
    </div>
}

function Cue({ cue: { text } }: { cue: VTTCue }) {
    return text && <div class="caption-visual-line">
        <div class="bg">
            <div class="ytp-caption-segment">{text}</div>
        </div></div>
}