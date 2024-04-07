import { useEffect } from "preact/hooks";
import { getVideoId, useCaptions, getCaptionId } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { setShowCap } from "../classes/store";
import { createPortal } from 'preact/compat';
import { YtTextTracks } from "./ytTextTracks";

export function YtControlPanel() {
    
    const container = document.querySelector('#movie_player video');
    const videoId = getVideoId();
    const capts = useCaptions();
    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true)
    }, [videoId])
    console.log('yt control panel')
    console.dir(capts);
    return <>{capts.map(caption => <YtLangCheckbox caption={caption} />)}
    {createPortal(<YtTextTracks />, container)}</>
}




//   stateChange(-1);