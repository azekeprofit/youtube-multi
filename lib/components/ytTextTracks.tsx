import { createRef } from "preact";
import { getCaptionId, getCaptions, type ytCaptionTrack } from "../classes/youtube";
import { useEffect } from "preact/hooks";
import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";
import { useStore } from "../classes/store";

function Track({ caption }: { caption: ytCaptionTrack }) {
    const captionId = getCaptionId(caption);
    const ref = createRef<HTMLTrackElement>();

    const { baseUrl } = caption;
    useEffect(() => {
        fetch(baseUrl).then(r => r.text()).then(text =>
            addLinesToTrack(ref.current.track, loadYoutubeCaptions(text)))
    }, [baseUrl])
    const showCap = useStore(s => s.showCap.get(captionId));
    useEffect(() => {
        ref.current.track.mode = showCap ? "showing" : "hidden"
    }, [showCap])

    return <track id={captionId} ref={ref} srclang={caption.languageCode}></track>
}

export function YtTextTracks() {
    const capts = getCaptions();
    return <>{capts.map(c => <Track caption={c} />)}</>
}