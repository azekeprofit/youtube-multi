import { useEffect } from "preact/hooks";
import { getVideoId, getCaptions, getCaptionId } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { setShowCap } from "../classes/store";


export function YtControlPanel() {
    const videoId = getVideoId();
    const capts = getCaptions();
    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true)
    }, [videoId])

    //   if (!getVideoPlayer().dataset.stateChangeListener)
    //   getVideoPlayer().addEventListener("onStateChange", getVideoPlayer().dataset.stateChangeListener = (e:number)=>{
    // if(e===-1)setCaptions(loadCaptions());
    // }));



    return <>{capts.map(caption => <YtLangCheckbox caption={caption} />)}</>
}




//   stateChange(-1);