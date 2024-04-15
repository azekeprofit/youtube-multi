import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { SrtCheckbox } from "./srtCheckbox";
import type { captionId, ytCaptionTrack } from "../model/youtube";

export function ScrollablePanel({ capIds, capts, srtCaps }: { capIds: captionId[], capts: ytCaptionTrack[], srtCaps: Record<captionId, string> }) {
    const ref = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<Timer>();
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const scroll = useCallback(() => {
        const scroll = ref.current;
        setShowLeft(scroll.scrollLeft != 0);
        setShowRight(scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15));
    }, [])

    useEffect(scroll, [])
    const mouseUp = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null;
        }
    }, [])

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
            <span class={`arrow left${showLeft ? ' show' : ''}`} {...mouseHold(-15)}>🠜</span>
            <div class="scroll" ref={ref} onScroll={scroll}>
                {capts.map(caption =>
                    <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
                {capIds.map(capId =>
                    <SrtCheckbox key={capId} label={srtCaps[capId]} captionId={capId} />)}
            </div>
            <span class={`arrow right ${showRight ? ' show' : ''}`} {...mouseHold(15)}>🠞</span>
        </div>
    </div>
}