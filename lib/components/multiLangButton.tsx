import { createPortal, useEffect, useState } from "preact/compat";
import { useCaptions } from "../hooks/useCaptions";
import { clearSrtCaptions, setShowCap, useSrt } from "../model/store";
import { getCaptionId, getVideoId, getVideoPlayer } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { ScrollablePanel } from "./scrollablePanel";

export function MultiLangButton() {
    const videoId = getVideoId();
    const player = getVideoPlayer();
    const capts = useCaptions();
    const srtCapsCount = useSrt(s => Object.keys(s.srtCaptions).length);
    const anyCaptions = (capts.length + srtCapsCount) > 0;

    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true);
        clearSrtCaptions();
        player.toggleSubtitlesOn();
    }, [videoId])
    const [pressed, setPressed] = useState(false);
    useEffect(() => {
        const originalCaptions = document.querySelector<HTMLDivElement>('#ytp-caption-window-container');
        if (originalCaptions) originalCaptions.style.display = pressed ? 'none' : '';
        if (!pressed) {
            player.toggleSubtitlesOn();
            player.toggleSubtitles();
        }
    }, [pressed])


    return <>
        {pressed && <ScrollablePanel />}
        <button
            class="ytp-subtitles-button ytp-button"
            aria-pressed={anyCaptions && pressed}
            onClick={() => { if (anyCaptions) setPressed(!pressed) }}
            title={anyCaptions ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
            <CcIcon opacity={anyCaptions ? 1 : .3} />
        </button>
        {createPortal(<SrtMenuItem />, document.getElementById('srtFileInput'))}
        {createPortal(pressed && <CaptionLines />, document.getElementById('youtube-multi-caption-container'))}
    </>
}