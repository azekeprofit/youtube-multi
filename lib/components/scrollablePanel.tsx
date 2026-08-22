import { createEffect, createSignal } from "solid-js";
import { srtContainer } from "../model/store";
import { SrtCheckboxes } from "./srtCheckbox";
import { YoutubeCaptionCheckboxes } from "./ytLangCheckbox";

export function ScrollablePanel() {
  let scroll = null as HTMLDivElement;
  let intervalRef = null as Timer;
  const [showLeft, setLeft] = createSignal(false);
  const [showRight, setRight] = createSignal(false);

  const doScroll = () => {
    if (scroll) {
      setLeft(scroll.scrollLeft != 0);
      setRight(scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15));
    }
  }

  const mouseUp = () => {
    if (intervalRef) {
      clearInterval(intervalRef)
      intervalRef = null;
    }
  }

  createEffect(() => srtContainer(), doScroll);
  const step = 15;
  const onMouseDown = () => {
    if (!intervalRef) {
      intervalRef = setInterval(() => scroll.scrollBy(step, 0), 100)
    }
  }

  return <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <span class={`arrow left${showLeft() ? ' show' : ''}`} onMouseDown={onMouseDown} onMouseUp={mouseUp} onMouseLeave={mouseUp}>🠜</span>
      <div class="scroll" ref={e => scroll = e} onScroll={doScroll}>
        <YoutubeCaptionCheckboxes />
        <SrtCheckboxes />
      </div>
      <span class={`arrow right ${showRight() ? ' show' : ''}`} onMouseDown={onMouseDown} onMouseUp={mouseUp} onMouseLeave={mouseUp}>🠞</span>
    </div>
  </div>
}
