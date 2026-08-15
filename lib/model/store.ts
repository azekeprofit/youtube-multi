import { getKeys } from "./getKeys";
import { type captionId, type videoId } from "./youtube";
import { createStore, useSelector } from "@xstate/store-preact";
import { persist } from '@xstate/store/persist';
import type { potEvent } from "../wrapper";

export type captionStatus = Date | boolean | undefined;

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const showCapsStore = createStore({
  context: {} as Record<captionId, captionStatus>, on: {
    add: (ctx, { captionId, show }: { captionId: captionId, show: captionStatus }) => ({ ...ctx, [captionId]: show }),
  }
}).with(persist({
  name: "youtube multi storage",
  version: 2,
  pick: (s) => {
    const previousDay = addDays(new Date(), -1);
    return Object.fromEntries(Object.entries(s).map(([key, value]) =>
      value === false ? [key, undefined] :
        value === true ? [key, new Date()] :
          value ? [key, new Date(value) > previousDay ? new Date(value) : undefined]
            : []));
  },
}
)
);

export function setShowCap(captionId: captionId, show: captionStatus) {
  showCapsStore.trigger.add({ captionId, show });
}

export const potStore = createStore({
  context: {} as Record<videoId, string>,
  on: {
    add: (ctx, { videoId, pot }: potEvent) => ctx[videoId] ? undefined : { ...ctx, [videoId]: pot }
  }
});

export const trackStore = createStore({
  context: {} as Record<captionId, TextTrack>,
  on: {
    add: (ctx, { captionId, track }: { captionId: captionId, track: TextTrack }) => ({ ...ctx, [captionId]: track })
  }
});

export const srtStore = createStore({
  context: {} as Record<captionId, string>, on: {
    add: (ctx, { fileName, captionId }: { fileName: string, captionId: captionId }) => ({ ...ctx, [captionId]: fileName }),
    clear: () => ({})
  }
});

export const useSrtKeys = () => useSelector(srtStore, ({ context }) => getKeys(context), (p, n) => getKeys(p!).length == getKeys(n!).length);
export const useSrtKeysCount = () => useSelector(srtStore, ({ context }) => getKeys(context).length);
