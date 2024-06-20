import { useEffect } from "preact/hooks";
import { useCaptions } from "../hooks/useCaptions";
import { useShowCaps, useTracks } from "../model/store";
import { loadYoutubeCaptions } from "../model/subtitle";
import { addTrack, extractName, getCaptionId, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { vssId, kind, baseUrl, name, languageCode } = caption;
    const captionId = getCaptionId(caption);

    const track = useTracks(s => s.cache[captionId]);
    const showCap = useShowCaps(s => s.showCap[captionId]);

    
    useEffect(() => {
        if (!track) {
            const newTrack = addTrack(captionId, vssId);
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

    return <CaptionCheckbox showCap={showCap} track={track} title={extractName(name)} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}

export function YoutubeCaptionCheckboxes(){
    const capts=useCaptions();
    return <>{capts.map(caption => <YtLangCheckbox key={caption.vssId} caption={caption} />)}</>
}