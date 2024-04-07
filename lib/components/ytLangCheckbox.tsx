import { setShowCap, useStore } from "../classes/store";
import { getCaptionId, type ytCaptionTrack } from "../classes/youtube";
import styles from './app.module.css';

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind } = caption;
    const captionId = getCaptionId(caption);
    const showCap = useStore(s => s.showCap.get(captionId));

    return <label class={styles.red}>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(caption, e.currentTarget.checked)} />
        {languageCode}{kind == 'asr' ? ' (auto)' : ''}
    </label>
}