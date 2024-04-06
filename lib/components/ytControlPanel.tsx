import { createSignal } from "solid-js";
import { getVideoId, loadCaptions, type ytCaptionTrack } from "../classes/youtube";
import { YtLangCheckbox } from "./ytLangCheckbox";
import { createStore } from "solid-js/store";

type captionStatus = 'enable' | 'disable' | undefined;

// const aButton = document.querySelector<HTMLElement>(`a${ccButtonSelector}`);
// aButton.setAttribute("aria-pressed", pressed ? "false" : "true");

const [store, setStore] = createStore<{ status: Record<string, captionStatus>, captions: Record<string, ytCaptionTrack[]> }>({ status: {}, captions: {} });

export function YtControlPanel() {
    switch (store.status[getVideoId()]) {
        case 'enable':
            store.status[getVideoId()] = 'disable';
            break;
        case 'disable':
            store.status[getVideoId()] = 'enable';
            break;
        default:
            store.status[getVideoId()] = 'enable';
    }

    //   if (!getVideoPlayer().dataset.stateChangeListener)
    //   getVideoPlayer().addEventListener("onStateChange", getVideoPlayer().dataset.stateChangeListener = (e:number)=>{
    // if(e===-1)setCaptions(loadCaptions());
    // }));

    return store.captions[getVideoId()].map(caption => <YtLangCheckbox caption={caption} />)
}




//   stateChange(-1);