import { useEffect, useMemo, useState } from "preact/hooks";
import { setShowCap, useStore } from "../classes/store";
import { getCaptionId, type captionId, type ytCaptionTrack } from "../classes/youtube";

import { addLinesToTrack, loadYoutubeCaptions } from "../classes/subtitle";

const trackCache = new Map<captionId, TextTrack>();

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const captionId = getCaptionId(caption);
    const showCap = useStore(s => s.showCap.get(captionId));
    const player = useMemo(() => document.querySelector<HTMLVideoElement>('#movie_player video'), []);
    const [track, setTrack] = useState<TextTrack>(null);

    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    useEffect(() => {
        let track = trackCache.get(captionId);
        if (!track) {
            track = player.addTextTrack('captions', caption.languageCode, caption.languageCode);
            fetch(baseUrl).then(r => r.text()).then(text =>
                addLinesToTrack(track, loadYoutubeCaptions(text)));
            trackCache.set(captionId, track);
        }
        setTrack(track);
        return () => {
            track.mode = 'disabled';
        }
    }, [baseUrl, player])

    return <label class={`ytp-button`}>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked)} />
        {`${languageCode}${kind == 'asr' ? ' (auto)' : ''}`}
    </label>
}