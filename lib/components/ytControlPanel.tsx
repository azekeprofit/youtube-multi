import { useEffect, useMemo, useState } from "preact/hooks";
import { setShowCap } from "../classes/store";
import { getCaptionId, getVideoId, useCaptions } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import './app.module.css'

export function YtControlPanel() {
    const videoId = getVideoId();
    const capts = useCaptions();
    const multiLangButton = useMemo(() => document.querySelector<HTMLAnchorElement>('a.ytp-subtitles-button.ytp-button'), []);
    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true)
        const originalButton = multiLangButton.nextElementSibling as HTMLButtonElement;
        multiLangButton.title = originalButton.title;
        multiLangButton.style.opacity = originalButton.style.opacity;
    }, [videoId])
    const [pressed, setPressed] = useState(true);
    useEffect(() => {
        multiLangButton.addEventListener('click', e => {
            setPressed(p => !p);
            e.preventDefault();
        });
    }, [multiLangButton])
    useEffect(() => {
        multiLangButton.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    }, [pressed]);

    if (!pressed) return null;

    return <>{capts.map(caption =>
        <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
    </>
}




//   stateChange(-1);