import { useEffect } from "preact/hooks";
import { getVideoId, useCaptions, getCaptionId } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { setShowCap } from "../classes/store";
import { createPortal } from 'preact/compat';
import { YtTextTracks } from "./ytTextTracks";

export function YtControlPanel() {
    const videoId = getVideoId();
    const capts = useCaptions();
    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true)
    }, [videoId])

    return <>{capts.map(caption => <YtLangCheckbox caption={caption} />)}
        <YtTextTracks captions={capts}  />
    </>
}




//   stateChange(-1);