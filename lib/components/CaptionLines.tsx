import { useEffect } from "preact/hooks";
import { trackCache, useStore } from "../model/store";
import { getCaptionId } from "../model/youtube";
import { forceUpdate } from "../hooks/forceUpdate";
import { useCaptions } from "../hooks/useCaptions";

export function CaptionLines() {
    const capts=useCaptions().map(getCaptionId);
    const activeTracks = useStore(s => capts.filter(c=>s.showCap[c]));
    const update = forceUpdate();

    useEffect(() => {
        const timer = setInterval(update, 500);
        return () => clearInterval(timer);
    }, [])

    return <div class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
        {activeTracks.map(cId =>
            <div class="captions-text" key={cId}>
                {Array.from(trackCache.get(cId)?.activeCues??[]).map((c: VTTCue) => <Cue cue={c} />)}
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