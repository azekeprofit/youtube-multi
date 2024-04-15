import { useRef, useState } from "preact/hooks";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { SrtCheckbox } from "./srtCheckbox";
import type { captionId, ytCaptionTrack } from "../model/youtube";

export function ScrollablePanel({ capIds, capts, srtCaps }: { capIds: captionId[], capts: ytCaptionTrack[], srtCaps: Record<captionId, string> }) {
    const ref = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<Timer>();
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    function mouseUp() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null;
        }
    }

    function mouseHold(step: number) {
        return {
            onMouseDown: () => {
                if (!intervalRef.current) {
                    intervalRef.current = setInterval(() => ref?.current.scrollBy(step, 0), 100)
                }
            }, onMouseUp: mouseUp, onMouseLeave: mouseUp
        }
    }

    return <div id="youtube-multi-checkboxes">
        <div class="unscroll">
            <div class="scroll" ref={ref} onScroll={() => {
                const scroll = ref.current;
                setShowLeft(scroll.scrollLeft != 0);
                setShowRight(scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15));
            }}>
                {capts.map(caption =>
                    <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
                {capIds.map(capId =>
                    <SrtCheckbox key={capId} label={srtCaps[capId]} captionId={capId} />)}
            </div>
            <i class={`arrow left${showLeft ? ' show' : ''}`} {...mouseHold(-15)}></i>
            <i class={`arrow right${showRight ? ' show' : ''}`} {...mouseHold(15)}></i>
        </div>
    </div>
}