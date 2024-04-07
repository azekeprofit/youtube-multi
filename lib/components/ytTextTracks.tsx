import { createRef } from "preact";
import { getCaptionId, useCaptions, type ytCaptionTrack } from "../classes/youtube";
import { useEffect, useState } from "preact/hooks";
import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";
import { useStore } from "../classes/store";

function Track({ caption, url }: { caption: ytCaptionTrack, url: string }) {
    const captionId = getCaptionId(caption);
    const player = document.querySelector<HTMLVideoElement>('#movie_player video');
    const showCap = useStore(s => s.showCap.get(captionId));
    const [track, setTrack] = useState<TextTrack>(null);

    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    useEffect(() => {
        console.log(`fetching ${getCaptionId(caption)}`)
        const track = player.addTextTrack('captions', caption.languageCode, caption.languageCode);
        fetch(url).then(r => r.text()).then(text =>
            addLinesToTrack(track, loadYoutubeCaptions(text)));

        setTrack(track);
        // clean-up
        return () => {
            console.log(`disabling ${getCaptionId(caption)}`)
            track.mode = 'disabled';
            // player.removeChild(track);
        }
    }, [url])

    return <track key={captionId} id={captionId} srclang={caption.languageCode} />;
}

export function YtTextTracks({ captions }: { captions: ytCaptionTrack[] }) {
    return <>{captions.map(c => <Track key={c.baseUrl} caption={c} url={c.baseUrl} />)}</>
}