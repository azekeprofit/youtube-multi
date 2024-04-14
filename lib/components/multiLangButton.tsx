import { createPortal, useEffect, useRef, useState } from "preact/compat";
import { useCaptions } from "../hooks/useCaptions";
import { clearSrtCaptions, setShowCap, useSrt } from "../model/store";
import { getCaptionId, getVideoId } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { SrtCheckbox } from "./srtCheckbox";
import { YtLangCheckbox } from "./ytLangCheckbox";

export function MultiLangButton() {
    const videoId = getVideoId();
    const capts = useCaptions();
    const srtCaps = useSrt(s => s.srtCaptions);
    const capIds = Object.keys(srtCaps);
    const anyCaptions = (capts.length + capIds.length) > 0;

    useEffect(() => {
        if (capts.length == 1)
            setShowCap(getCaptionId(capts[0]), true);
        clearSrtCaptions();
    }, [videoId])
    const [pressed, setPressed] = useState(false);
    useEffect(() => {
        const originalCaptions = document.querySelector<HTMLDivElement>('#ytp-caption-window-container');
        if (originalCaptions) originalCaptions.style.display = pressed ? 'none' : '';
    }, [pressed])

    const ref = useRef<HTMLDivElement>(null);
    const intervalRef=useRef<Timer>();

    function mouseDown(step:number){
        return ()=>{
        if(!intervalRef.current){
            intervalRef.current=setInterval(()=>ref?.current.scrollBy(step,0), 100)
        }}
    }
    
    
    function mouseUp(){
        if(intervalRef.current){
            clearInterval(intervalRef.current)
            intervalRef.current=null;
        }
    }
    

    return <>
        {pressed&&<div className="youtube-multi-checkboxes">
            <div class="not-to-scroll">
                <div className="scroll" ref={ref}>
                    {capts.map(caption =>
                        <YtLangCheckbox key={caption.baseUrl} caption={caption} />)}
                    {capIds.map(capId =>
                        <SrtCheckbox key={capId} label={srtCaps[capId]} captionId={capId} />)}
                </div>
                <div class="carousel-arrows">
                    <i class="arrow left" onMouseDown={mouseDown(-15)} onMouseUp={mouseUp} onMouseLeave={mouseUp}  ></i>
                    <i class="arrow right" onMouseDown={mouseDown(15)} onMouseUp={mouseUp} onMouseLeave={mouseUp}  ></i>
                </div>
            </div>
        </div>}
        <button
            class="ytp-subtitles-button ytp-button"
            aria-pressed={anyCaptions && pressed}
            onClick={() => { if (anyCaptions) setPressed(!pressed) }}
            title={anyCaptions ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
            <CcIcon opacity={anyCaptions ? 1 : .3} />
        </button>
        {createPortal(<SrtMenuItem />, document.getElementById('srtFileInput'))}
        {createPortal(pressed && <CaptionLines />, document.getElementById('youtube-multi-caption-container'))}
    </>
}