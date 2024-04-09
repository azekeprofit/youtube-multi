import { useEffect, useState } from "preact/hooks";
import { trackCache, useStore } from "../model/store";
import { addLinesToTrack, loadYoutubeCaptions } from "../model/subtitle";
import { getCaptionId, getVideoTag, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

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