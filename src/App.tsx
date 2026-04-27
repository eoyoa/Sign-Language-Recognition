import Webcam from "react-webcam";
import "./App.css";
import {useCallback, useRef, useState} from "react";
import {watchWebcam} from "./lib/hand-landmarking.ts";
import type {Sign} from "./lib/hand-landmarking.ts";
import {SignMap, type SignMapEntry} from "./lib/sign-map.ts";

const response = await fetch("/MappingDatabase.json");
const mappingDatabase: SignMapEntry[] = await response.json();
console.log("mappingDatabase:", mappingDatabase);
const signDb = new SignMap(mappingDatabase);

function App() {
    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [word, setWord] = useState("")
    const [pendingSign, setPendingSign] = useState<Sign | null>(null)

    const handleSave = useCallback(() => {
        if (!pendingSign || !word) return;
        const { frames } = pendingSign;
        signDb.addSignToDatabase({ frames, word});
        setWord("");
        setPendingSign(null);
    }, [pendingSign, word]);

    const handleCamReady = useCallback(() => {
        if (canvasRef.current === null || webcamRef.current === null) return;
        if (webcamRef.current.video === null) return;

        // TODO: internal tool team probably needs to add some sort
        //  of button that can switch the passed in signDbFn
        // this returns a reference to the signs
        const signs = watchWebcam(webcamRef.current.video, canvasRef.current, setPendingSign)
        console.log("signs:", signs)
    }, []);

    return <>
        <Webcam id={"webcam"} ref={webcamRef} onCanPlay={handleCamReady}></Webcam>
        <canvas id={"canvas"} ref={canvasRef}></canvas>
        <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter Word Here"
        />
        <button onClick={handleSave}>
            Save
        </button>
    </>;
}

export default App
