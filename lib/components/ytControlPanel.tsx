import { Show, createSignal } from "solid-js";
import { getVideoPlayer, loadCaptions, type ytCaptionTrack } from "../classes/youtube";
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
        <Show when={showPanel()}>{captions().map(caption => <YtLangCheckbox caption={caption} />)}</Show>
    </>
}




//   stateChange(-1);