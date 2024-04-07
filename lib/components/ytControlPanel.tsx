import { useEffect, useMemo, useState } from "preact/hooks";
import { setShowCap } from "../classes/store";
import { getCaptionId, getVideoId, useCaptions } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import './app.module.css'

export function YtControlPanel() {
    const videoId = getVideoId();
    const capts = useCaptions();
    const anyCaptions = capts.length > 0;

    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true)
    }, [videoId])
    const [pressed, setPressed] = useState(anyCaptions);
    const multiLangButton = useMemo(() => document.querySelector<HTMLAnchorElement>('a.ytp-subtitles-button.ytp-button'), []);
    useEffect(() => {
        multiLangButton.addEventListener('click', e => {
            if (anyCaptions) setPressed(p => !p);
            e.preventDefault();
        });
    }, [multiLangButton, anyCaptions])
    useEffect(() => {
        multiLangButton.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    }, [pressed, multiLangButton]);

    if (!pressed) return null;

    return <>{capts.map(caption =>
        <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
    </>
}




//   stateChange(-1);