import { useEffect } from "preact/hooks";
import { getVideoId, getCaptions } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { loadTrack } from "../classes/store";


export function YtControlPanel() {
    const videoId = getVideoId();
    useEffect(() => {
        getCaptions().forEach(loadTrack)
    }, [videoId])

    //   if (!getVideoPlayer().dataset.stateChangeListener)
    //   getVideoPlayer().addEventListener("onStateChange", getVideoPlayer().dataset.stateChangeListener = (e:number)=>{
    // if(e===-1)setCaptions(loadCaptions());
    // }));

    return <>{getCaptions().map(caption => <YtLangCheckbox caption={caption} />)}</>
}




//   stateChange(-1);