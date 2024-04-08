import { useEffect, useMemo, useState } from "preact/hooks";
import { setShowCap, trackCache, useStore } from "../classes/store";
import { getCaptionId, type captionId, type ytCaptionTrack } from "../classes/youtube";
import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";
import './app.module.css'
import { CaptionCheckbox } from "./CaptionCheckbox";

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const captionId = getCaptionId(caption);
    const showCap = useStore(s => s.showCap[captionId]);
    const player = useMemo(() => document.querySelector<HTMLVideoElement>('#movie_player video'), []);
    const [track, setTrack] = useState<TextTrack>(null);

    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    useEffect(() => {
        let track = trackCache.get(captionId);
        if (!track) {
            track = player.addTextTrack('captions', languageCode, languageCode);
            fetch(baseUrl).then(r => r.text()).then(text =>
                addLinesToTrack(track, loadYoutubeCaptions(text)));
            trackCache.set(captionId, track);
        }
        setTrack(track);
        return () => {
            track.mode = 'disabled';
        }
    }, [baseUrl, player])

    return <CaptionCheckbox showCap={showCap} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}