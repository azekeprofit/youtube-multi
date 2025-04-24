import DomPurify from 'dompurify';
import { useMemo } from "preact/hooks";

export function Cue({ cue: { text } }: { cue: VTTCue }) {
  const parsed = useMemo(() =>
    DomPurify.sanitize(text, { ALLOWED_TAGS: ['b', 'i', 'u', 'font'], RETURN_TRUSTED_TYPE: true })
    , [text]);

  return (
    parsed && (
      <div class="caption-visual-line">
        <div class="bg">
          <div class="ytp-caption-segment" dangerouslySetInnerHTML={{ 
            __html: parsed as unknown as string // hacking the type since Preact innerHTML doesn't list TrustedHTML as possible type
           }}>
          </div>
        </div>
      </div>
    ))
}
