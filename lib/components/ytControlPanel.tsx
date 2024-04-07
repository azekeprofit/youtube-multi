import { useEffect } from "preact/hooks";
import { setShowCap } from "../classes/store";
import { getCaptionId, getVideoId, useCaptions } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";

export function YtControlPanel() {
    const videoId = getVideoId();
    const capts = useCaptions();
    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true)
    }, [videoId])

    return <>{capts.map(caption =>
        <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
    </>
}




//   stateChange(-1);