import { createSignal } from "solid-js";
import { loadCaptions } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";

export const styleStud = "hflkjdhgjhdfkjdshgkljdfghkdjhgkdjrhgigre";

export function YtControlPanel() {
    const [captions, setCaptions] = createSignal(loadCaptions());
    const [showPanel, setShowPanel] = createSignal(true);

    //   if (!getVideoPlayer().dataset.stateChangeListener)
    //   getVideoPlayer().addEventListener("onStateChange", getVideoPlayer().dataset.stateChangeListener = (e:number)=>{
    // if(e===-1)setCaptions(loadCaptions());
    // }));

    return <>
        <style>{styleStud}</style>
        {captions().map(caption => <YtLangCheckbox caption={caption} />)}
    </>
}




//   stateChange(-1);