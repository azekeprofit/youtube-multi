
import { render } from "preact";
import { YtControlPanel } from "./components/ytControlPanel";
import { YtTextTracks } from "./components/ytTextTracks";

render(<YtControlPanel />, document.getElementById("ytControlPanel"));
render(<YtTextTracks />, document.getElementsByTagName("video")[0]);