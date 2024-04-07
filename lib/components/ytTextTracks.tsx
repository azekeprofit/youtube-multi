import { createRef } from "preact";
import { getCaptionId, useCaptions, type ytCaptionTrack } from "../classes/youtube";
import { useEffect } from "preact/hooks";
import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";
import { useStore } from "../classes/store";

function Track({ caption, url }: { caption: ytCaptionTrack, url: string }) {
    const captionId = getCaptionId(caption);
    const ref = createRef<HTMLTrackElement>();

    useEffect(() => {
        console.log(`fetching ${getCaptionId(caption)}`)
        const track = ref.current.track;
        fetch(url).then(r => r.text()).then(text =>
            addLinesToTrack(track, loadYoutubeCaptions(text)))

        // clean-up
        return () => {
            console.log(`disabling ${getCaptionId(caption)}`)
            track.mode = 'disabled'
        }
    }, [url, ref.current])
    const showCap = useStore(s => s.showCap.get(captionId));
    useEffect(() => {
        ref.current.track.mode = showCap ? "showing" : "hidden"
    }, [showCap])

    return <track id={captionId} ref={ref} srclang={caption.languageCode}></track>
}

export function YtTextTracks() {
    const capts = useCaptions();
    return <>{capts.map(c => <Track caption={c} url={c.baseUrl} />)}</>
}