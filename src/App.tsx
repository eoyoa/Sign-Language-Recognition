import Webcam from "react-webcam";
import "./App.css";
import {useCallback, useRef, useState} from "react";
import type {Sign} from "./lib/landmark-detection.ts";
import {watchWebcam} from "./lib/landmark-detection.ts";
import {SignMap} from "./lib/sign-map.ts";
import {isValidMapData, type SignMapEntry} from "./lib/util.ts";

const response = await fetch("/MappingDatabase.json");
const mappingDatabase: SignMapEntry[] = JSON.parse(await response.text());
console.log("mappingDatabase:", mappingDatabase);
const signDb = isValidMapData(mappingDatabase) ? new SignMap(mappingDatabase) : new SignMap();

function App() {
    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [word, setWord] = useState("")
    const [pendingSign, setPendingSign] = useState<Sign | null>(null)

    const handleSave = useCallback(() => {
        if (!pendingSign || !word) return;
        const {vectors} = pendingSign;
        signDb.addSignToMap({vectors, word});
        setWord("");
        setPendingSign(null);
    }, [pendingSign, word]);

    const handleExport = useCallback(() => {
        const json = JSON.stringify(signDb.map);
        // save to public/MappingDatabase.json
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "MappingDatabase.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [])

    const handleCamReady = useCallback(() => {
        if (canvasRef.current === null || webcamRef.current === null) return;
        if (webcamRef.current.video === null) return;

        // TODO: internal tool team probably needs to add some sort
        //  of button that can switch the passed in signDbFn
        // this returns a reference to the signs
        const signs = watchWebcam(webcamRef.current.video, canvasRef.current, (sign) => {
            setPendingSign(sign);
            signDb.recognizeSign(sign)
        })
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
        <button onClick={handleExport}>
            Export Database
        </button>
    </>;
}

export default App
