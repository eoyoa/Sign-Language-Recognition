import Webcam from "react-webcam";
import "./App.css";
import {useCallback, useRef} from "react";
import {watchWebcam} from "./lib/hand-landmarking.ts";
import {SignMap} from "./lib/sign-map.ts";

const signDb = new SignMap();

function App() {
    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleCamReady = useCallback(() => {
        if (canvasRef.current === null || webcamRef.current === null) return;
        if (webcamRef.current.video === null) return;

        // TODO: internal tool team probably needs to add some sort
        //  of button that can switch the passed in signDbFn
        // this returns a reference to the signs
        const signs = watchWebcam(webcamRef.current.video, canvasRef.current, signDb.recognizeSign)
        console.log("signs:", signs)
    }, []);

    return <>
        <Webcam id={"webcam"} ref={webcamRef} onCanPlay={handleCamReady}></Webcam>
        <canvas id={"canvas"} ref={canvasRef}></canvas>
    </>;
}

export default App
