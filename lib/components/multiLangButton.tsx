import { createPortal, useEffect, useState } from "preact/compat";
import { useCaptions } from "../hooks/useCaptions";
import { clearSrtCaptions, setShowCap, useSrt } from "../model/store";
import { getCaptionId, getVideoId } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { SrtCheckbox } from "./srtCheckbox";
import { YtLangCheckbox } from "./ytLangCheckbox";

export function MultiLangButton() {
    const videoId = getVideoId();
    const capts = useCaptions();
    const anyCaptions = capts.length > 0;
    const srtCaps = useSrt(s => s.srtCaptions);

    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true);
        clearSrtCaptions();
    }, [videoId])
    const [pressed,setPressed] = useState(false);
    useEffect(() => {
        const originalCaptions = document.querySelector<HTMLDivElement>('#ytp-caption-window-container');
        if (originalCaptions) originalCaptions.style.display = pressed ? 'none' : '';
    }, [pressed])

    return <>
        {pressed && capts.map(caption =>
            <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
        {pressed && Object.keys(srtCaps).map(capId =>
            <SrtCheckbox key={capId} label={srtCaps[capId]} captionId={capId} />)}
        <button
            class="ytp-subtitles-button ytp-button"
            aria-pressed={anyCaptions && pressed}
            onClick={() => { if (anyCaptions) setPressed(!pressed) }}
            title={anyCaptions ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
            <svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill-opacity={anyCaptions ? 1 : .3}>
                <use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use>
                <path d="M11,11 C9.89,11 9,11.9 9,13 L9,23 C9,24.1 9.89,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 L17,17 Z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45,15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 L24,17 Z" fill="#fff" />
            </svg>
        </button>
        {createPortal(<SrtMenuItem />, document.getElementById('srtFileInput'))}
        {createPortal(pressed && <CaptionLines />, document.getElementById('youtube-multi-caption-container'))}
    </>
}