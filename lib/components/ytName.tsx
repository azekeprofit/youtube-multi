import { type ytName } from "../classes/youtube";

export function YtName({name}:{name:ytName}){
    return <>{name.simpleText}</>;
}