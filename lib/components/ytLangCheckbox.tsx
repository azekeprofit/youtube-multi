import { useEffect } from "preact/hooks";
import { useShowCaps, useTracks } from "../model/store";
import { loadYoutubeCaptions } from "../model/subtitle";
import { addTrack, getCaptionId, getTranslation, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const captionId = getCaptionId(caption);

    const track = useTracks(s => s.cache[captionId]);
    const showCap = useShowCaps(s => s.showCap[captionId]);

    useEffect(() => {
        if (!track) {
            const newTrack = addTrack(captionId, languageCode);
            return () => {
                newTrack.mode = 'disabled';
            }
        }
    }, [])

    useEffect(() => {
        // loadYoutubeCaptions always adds at least one cue so by checking if cues are empty we prevent over-fetching
        if (track && showCap && track.cues.length == 0)
            fetch(baseUrl).then(r => r.text()).then(text =>
                loadYoutubeCaptions(captionId, track, text));
    }, [showCap, track])

    return <CaptionCheckbox track={track} title={getTranslation(languageCode)} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}