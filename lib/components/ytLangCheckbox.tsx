import { useAtomValue } from "jotai";
import { useEffect } from "preact/hooks";
import { useCaptions } from "../hooks/useCaptions";
import { loadSrtLine } from "../model/srtSubtitle";
import { potFam, useShowCaps, useTracks } from "../model/store";
import { addTrack, extractName, getCaptionId, getVideoId, getVideoPlayer, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { vssId, kind, baseUrl, name, languageCode } = caption;
    const captionId = getCaptionId(caption);

    const track = useTracks(s => s.cache[captionId]);
    const showCap = useShowCaps(s => s.showCap[captionId]);
    const [_,pot] = useAtomValue(potFam([getVideoId(),'']));
    useEffect(() => {
        if (!track) {
            const newTrack = addTrack(captionId, vssId);
            return () => {
                newTrack.mode = 'disabled';
            }
        }
    }, [])

    useEffect(() => {
        if (!pot) getVideoPlayer().toggleSubtitlesOn();
        // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
        if (showCap && track?.cues?.length === 0 && pot) {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => loadSrtLine(track, captionId, xhr.responseText);
            xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
            xhr.responseType = "text";
            xhr.send();
        }
    }, [showCap, track, pot])

    return <CaptionCheckbox showCap={showCap} track={track} title={extractName(name)} label={`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`} captionId={captionId} />
}

export function YoutubeCaptionCheckboxes() {
    const capts = useCaptions();
    return <>{capts.map(caption => <YtLangCheckbox key={caption.vssId} caption={caption} />)}</>
}