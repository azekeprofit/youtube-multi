import { setShowCap, useStore } from "../classes/store";
import type { ytCaptionTrack } from "../classes/youtube";
import styles from './app.module.css';

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind, baseUrl } = caption;
    const showCap = useStore(s => s.showCap.get(baseUrl));
    if (kind === 'asr') return null;

    return <label class={styles.red}>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(baseUrl, e.currentTarget.checked)} />
        {languageCode}
    </label>
}