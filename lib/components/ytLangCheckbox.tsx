import { setShowCap, useStore } from "../classes/store";
import { getVideoId, type ytCaptionTrack } from "../classes/youtube";
import styles from './app.module.css';

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind } = caption;
    const showCap = useStore(s => s.showCap.get(`${getVideoId()}.${languageCode}`));
    if (kind === 'asr') return null;

    return <label class={styles.red}>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(languageCode, e.currentTarget.checked)} />
        {languageCode}
    </label>
}