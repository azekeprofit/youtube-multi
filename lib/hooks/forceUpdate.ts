import { useReducer } from "preact/hooks";

export function forceUpdate() {
  const [, update] = useReducer(() => ({}), {});
  return update;
}