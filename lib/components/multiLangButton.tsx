import { createPortal, useEffect, useState } from "preact/compat";
import { useCaptions } from "../hooks/useCaptions";
import { clearSrtCaptions, setShowCap, useSrt } from "../model/store";
import { getCaptionId, getVideoId } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { SrtCheckbox } from "./srtCheckbox";
import { YtLangCheckbox } from "./ytLangCheckbox";

export function MultiLangButton() {
    const videoId = getVideoId();
    const capts = useCaptions();
    const srtCaps = useSrt(s => s.srtCaptions);
    const capIds=Object.keys(srtCaps);
    const anyCaptions = (capts.length+capIds.length) > 0;

    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true);
        clearSrtCaptions();
    }, [videoId])
    const [pressed, setPressed] = useState(false);
    useEffect(() => {
        const originalCaptions = document.querySelector<HTMLDivElement>('#ytp-caption-window-container');
        if (originalCaptions) originalCaptions.style.display = pressed ? 'none' : '';
    }, [pressed])

    return <>
    <span className="youtube-multi-checkboxes">
        {pressed && capts.map(caption =>
            <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
        {pressed && capIds.map(capId =>
            <SrtCheckbox key={capId} label={srtCaps[capId]} captionId={capId} />)}
            </span>
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