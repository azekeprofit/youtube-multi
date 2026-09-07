import { useComputed, useSignal, useSignalEffect, type ReadonlySignal } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import { useCallback } from "preact/hooks";
import { srtContainer } from "../model/store";
import { SrtCheckboxes } from "./srtCheckbox";
import { YoutubeCaptionCheckboxes } from "./ytLangCheckbox";
import type { HTMLAttributes } from "preact";

export function ScrollablePanel() {
  const scrollDiv = useSignalRef<HTMLDivElement>(null);
  const intervalRef = useSignalRef<Timer>(null);
  const showLeft = useSignal(false);
  const showRight = useSignal(false);

  const doScroll = useCallback(() => {
    const scroll = scrollDiv.current;
    if (scroll) {
      showLeft.value = scroll.scrollLeft != 0;
      showRight.value = scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15);
    }
  }, [])

  const mouseHold = useCallback((step: number) => {
    const mouseUp = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null;
      }
    }

    return {
      onMouseDown: () => {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            scrollDiv.current.scrollBy(step, 0);
            doScroll();
          }, 100)
        }
      }, onMouseUp: mouseUp, onMouseLeave: mouseUp
    }
  }, [])

  useSignalEffect(() => {
    srtContainer.value; // subscribe to srtContainer changes, so arrow will apropriately appear when a new SRT-caption was added
    setTimeout(doScroll, 100); // pause to give component some time to render checkboxes
    doScroll(); // so i don't have to create another useEffect just for initial render
  })

  return <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <Arrow text='🠜' show={showLeft} direction="left" attr={mouseHold(-15)} />
      <div class="scroll" ref={scrollDiv}>
        <YoutubeCaptionCheckboxes />
        <SrtCheckboxes />
      </div>
      <Arrow text='🠞' show={showRight} direction="right" attr={mouseHold(15)} />
    </div>
  </div>
}

const Arrow = ({ show, text, direction, attr }:
  { show: ReadonlySignal<boolean>, text: string, direction: 'left' | 'right', attr: HTMLAttributes<HTMLElement> }) =>
  <span class={useComputed(() => `arrow ${direction} ${show.value ? 'show' : ''}`)} {...attr}>{text}</span>
