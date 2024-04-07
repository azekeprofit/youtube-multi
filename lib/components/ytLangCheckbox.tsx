import { useEffect, useState } from "preact/hooks";
import { setShowCap, useStore } from "../classes/store";
import { getCaptionId, type ytCaptionTrack } from "../classes/youtube";
import styles from './app.module.css';
import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const captionId = getCaptionId(caption);
    const showCap = useStore(s => s.showCap.get(captionId));
    const player = document.querySelector<HTMLVideoElement>('#movie_player video');
    const [track, setTrack] = useState<TextTrack>(null);

    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])
    
    useEffect(() => {
        console.log(`fetching ${getCaptionId(caption)}`)
        const track = player.addTextTrack('captions', caption.languageCode, caption.languageCode);
        fetch(baseUrl).then(r => r.text()).then(text =>
            addLinesToTrack(track, loadYoutubeCaptions(text)));

        setTrack(track);
        // clean-up
        return () => {
            console.log(`disabling ${getCaptionId(caption)}`)
            track.mode = 'disabled';
            // player.removeChild(track);
        }
    }, [baseUrl])

    return <label class={`${styles.red} ytp-button`}>
        <input type="checkbox" checked={showCap} 
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked)} />
        {`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`}
    </label>
}