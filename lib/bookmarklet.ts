import { render } from "solid-js/web";
import { YtControlPanel } from "./components/ytControlPanel";

const controlPanel = document.getElementById("ytControlPanel") as HTMLElement;
render(YtControlPanel, controlPanel);