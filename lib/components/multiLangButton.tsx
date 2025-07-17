import { createPortal, useEffect, useState } from "preact/compat";
import { useCaptions } from "../hooks/useCaptions";
import { clearSrtCaptions, setShowCap, usePots, useSrt } from "../model/store";
import { getCaptionId, getVideoId, getVideoPlayer } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { ScrollablePanel } from "./scrollablePanel";
import { getKeys } from "../model/getKeys";

export function MultiLangButton() {
    const videoId = getVideoId();
    const player = getVideoPlayer();
    const capts = useCaptions();
    const srtCapsCount = useSrt(s => getKeys(s.srtCaptions).length);
    const anyCaptions = (capts.length + srtCapsCount) > 0;

    useEffect(() => {
        player.toggleSubtitlesOn();

        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true);
        clearSrtCaptions();
    }, [videoId])
    const [pressed, setPressed] = useState(false);


    return <>
        {pressed && <ScrollablePanel />}
        <button
            class="ytp-subtitles-button ytp-button"
            aria-pressed={anyCaptions && pressed}
            onClick={anyCaptions ? () => { setPressed(!pressed); player.toggleSubtitlesOn(); if (!pressed) player.toggleSubtitles() } : undefined}
            title={anyCaptions ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
            <CcIcon opacity={anyCaptions ? 1 : .3} />
        </button>
        {createPortal(<SrtMenuItem />, document.getElementById('srtFileInput'))}
        {createPortal(pressed && <CaptionLines />, document.getElementById('youtube-multi-caption-container'))}
    </>
}