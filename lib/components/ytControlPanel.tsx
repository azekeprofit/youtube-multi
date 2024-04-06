import { useEffect } from "preact/hooks";
import { getVideoId, getCaptions } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { loadTrack, setButton, useStore } from "../classes/store";


export function YtControlPanel() {
    const videoId = getVideoId();
    const button = useStore(s => s.button.get(videoId));
    useEffect(() => {
        setButton(!button);
        getCaptions().forEach(loadTrack)
    }, [])



    //   if (!getVideoPlayer().dataset.stateChangeListener)
    //   getVideoPlayer().addEventListener("onStateChange", getVideoPlayer().dataset.stateChangeListener = (e:number)=>{
    // if(e===-1)setCaptions(loadCaptions());
    // }));

    return <>{button && getCaptions().map(caption => <YtLangCheckbox caption={caption} />)}</>
}




//   stateChange(-1);