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
            <path
     style="fill:white"
     d="M 12.005859 11 C 10.340381 11 9 12.340381 9 14.005859 L 9 21.994141 C 9 23.659619 10.340381 25 12.005859 25 L 23.994141 25 C 25.659619 25 27 23.659619 27 21.994141 L 27 14.005859 C 27 12.340381 25.659619 11 23.994141 11 L 12.005859 11 z M 15.525391 15 C 16.120055 15 16.75693 15.085322 17.435547 15.257812 L 17.435547 16.066406 C 16.742938 15.795775 16.095801 15.660156 15.494141 15.660156 C 14.798033 15.660156 14.224683 15.8783 13.773438 16.3125 C 13.32569 16.7467 13.101562 17.298585 13.101562 17.970703 C 13.101562 18.648769 13.356067 19.20354 13.863281 19.634766 C 14.370495 20.065992 15.022762 20.28125 15.820312 20.28125 C 16.30304 20.28125 16.87126 20.175064 17.525391 19.960938 L 17.525391 20.683594 C 16.832781 20.894746 16.180514 21 15.568359 21 C 14.497963 21 13.6346 20.727831 12.980469 20.183594 C 12.326338 19.636383 12 18.918515 12 18.029297 C 12 17.128183 12.325929 16.396998 12.976562 15.837891 C 13.627196 15.278784 14.475983 15 15.525391 15 z M 22 15 C 22.594665 15 23.231539 15.085322 23.910156 15.257812 L 23.910156 16.066406 C 23.217547 15.795775 22.570411 15.660156 21.96875 15.660156 C 21.272643 15.660156 20.699292 15.8783 20.248047 16.3125 C 19.800299 16.7467 19.576172 17.298585 19.576172 17.970703 C 19.576172 18.648769 19.830677 19.20354 20.337891 19.634766 C 20.845105 20.065992 21.497372 20.28125 22.294922 20.28125 C 22.77765 20.28125 23.345869 20.175064 24 19.960938 L 24 20.683594 C 23.307391 20.894746 22.655123 21 22.042969 21 C 20.972572 21 20.109209 20.727831 19.455078 20.183594 C 18.800947 19.636383 18.474609 18.918515 18.474609 18.029297 C 18.474609 17.128183 18.800539 16.396998 19.451172 15.837891 C 20.101805 15.278784 20.950592 15 22 15 z " />
            </svg>
        </button>
        {createPortal(<SrtMenuItem />, document.getElementById('srtFileInput'))}
        {createPortal(pressed && <CaptionLines />, document.getElementById('youtube-multi-caption-container'))}
    </>
}