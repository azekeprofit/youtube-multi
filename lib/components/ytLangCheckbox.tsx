import { useEffect } from "preact/hooks";
import { useShowCaps, useTracks } from "../model/store";
import { loadYoutubeCaptions } from "../model/subtitle";
import { addTrack, getCaptionId, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const captionId = getCaptionId(caption);

    const track = useTracks(s => s.cache[captionId]);
    
    useEffect(() => {
        if (!track) {
            const newTrack = addTrack(captionId, languageCode);
            fetch(baseUrl).then(r => r.text()).then(text =>
                loadYoutubeCaptions(captionId, newTrack, text));
            return () => {
                newTrack.mode = 'disabled';
            }
        }
    }, [])

    return <CaptionCheckbox track={track} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}