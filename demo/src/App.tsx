import Webcam from "react-webcam";
import "./App.css";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    createLandmarker,
    createClassificationWorker,
    updateDb,
    createRecognizeHandler,
    onClassificationResult,
    SignMap,
    isValidDatabaseFile,
    isDatabaseVersionCompatible,
    DB_VERSION,
} from "sign-language-recognition";
import type {Sign, MappingDatabaseFile} from "sign-language-recognition";

const response = await fetch("/MappingDatabase.json");
const mappingDatabase: MappingDatabaseFile = JSON.parse(await response.text());
console.log("mappingDatabase:", mappingDatabase);
if (isValidDatabaseFile(mappingDatabase) && !isDatabaseVersionCompatible(mappingDatabase)) {
    console.warn(`MappingDatabase.json version "${mappingDatabase.version}" is incompatible with library version "${DB_VERSION}". Starting with an empty database.`);
}
const signDb = isValidDatabaseFile(mappingDatabase) && isDatabaseVersionCompatible(mappingDatabase)
    ? new SignMap(mappingDatabase.mappings)
    : new SignMap();

const landmarker = await createLandmarker({
    wasmPath: "/wasm",
    handTaskPath: "/tasks/hand_landmarker.task",
    poseTaskPath: "/tasks/pose_landmarker_lite.task",
});

const classificationWorker = createClassificationWorker(
    new URL("sign-language-recognition/worker", import.meta.url),
    signDb.map
);

function App() {
    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [word, setWord] = useState("")
    const [pendingSign, setPendingSign] = useState<Sign | null>(null)
    const [recognizedWord, setRecognizedWord] = useState<string>("")
    const [recognizedDistance, setRecognizedDistance] = useState<number | null>(null)

    useEffect(() => {
        onClassificationResult(classificationWorker, ({ word, distance }) => {
            console.log("recognized:", word, "distance:", distance);
            setRecognizedWord(word);
            setRecognizedDistance(distance);
        });
    }, []);

    const handleSave = useCallback(() => {
        if (!pendingSign || !word) return;
        const {vectors} = pendingSign;
        signDb.addSignToMap({vectors, word});
        updateDb(classificationWorker, signDb.map);
        setWord("");
        setPendingSign(null);
    }, [pendingSign, word]);

    const handleExport = useCallback(() => {
        const file: MappingDatabaseFile = { version: DB_VERSION, mappings: signDb.map };
        const json = JSON.stringify(file, null, 2);
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

        const recognize = createRecognizeHandler(classificationWorker);
        const signs = landmarker.watchWebcam(webcamRef.current.video, canvasRef.current, (sign) => {
            setPendingSign(sign);
            recognize(sign);
        });
        console.log("signs:", signs);
    }, []);

    return <>
        <Webcam id={"webcam"} ref={webcamRef} onCanPlay={handleCamReady}></Webcam>
        <canvas id={"canvas"} ref={canvasRef}></canvas>
        {recognizedWord && <p>Recognized: <strong>{recognizedWord}</strong> (distance: {recognizedDistance?.toFixed(4)})</p>}
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
