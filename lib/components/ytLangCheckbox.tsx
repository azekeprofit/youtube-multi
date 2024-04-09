import { useEffect, useState } from "preact/hooks";
import { trackCache, useStore } from "../classes/store";
import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";
import { getCaptionId, getVideoTag, type ytCaptionTrack } from "../classes/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";
import './app.module.css';

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const captionId = getCaptionId(caption);
    const showCap = useStore(s => s.showCap[captionId]);

    const [track, setTrack] = useState<TextTrack>(null);

    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    useEffect(() => {
        let track = trackCache.get(captionId);
        if (!track) {
            track = getVideoTag().addTextTrack('captions', languageCode, languageCode);
            fetch(baseUrl).then(r => r.text()).then(text =>
                addLinesToTrack(track, loadYoutubeCaptions(text)));
            trackCache.set(captionId, track);
        }
        setTrack(track);
        return () => {
            track.mode = 'disabled';
        }
    }, [baseUrl])

    return <CaptionCheckbox showCap={showCap} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}