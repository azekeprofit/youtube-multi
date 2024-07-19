import type { ComponentChildren } from "preact";
import Markup from "preact-markup";
import { useMemo } from "preact/hooks";

function htmlDecode(input: string) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  
  const components = { i: ({ children }: { children: ComponentChildren }) => <> <i>{children}</i></> };
  
  export function Cue({ cue: { text } }: { cue: VTTCue }) {
    const parsed = useMemo(() => htmlDecode(text), [text]);
  
    return (
      parsed && (
        <div class="caption-visual-line">
          <div class="bg">
            <div class="ytp-caption-segment">
              <Markup markup={parsed} type="html" components={components} />
            </div>
          </div>
        </div>
      )
    );
  }
  