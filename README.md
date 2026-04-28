# Sign Language Recognition

## Running the demo

`cd` to `demo/`.

Then start the dev server with `npm run dev`.

Then visit the URL that Vite hosted it on on your browser.

(It's likely `localhost:5173`.)

## Using this library in your project

### Installation

Install the library directly from GitHub:

```bash
npm install github:eoyoa/Sign-Language-Recognition
```

npm v7+ automatically installs peer dependencies, so `@mediapipe/tasks-vision` will be pulled in for you.

### Required assets

The landmarker needs two sets of static assets served and referenced by your app:

**WASM runtime** — these vision WASM files are located inside the installed MediaPipe package.

**Model task files** — download the hand and pose landmarker models. You can find this in the online MediaPipe documentation.

### Usage

The example below mirrors how the demo uses the library. It initializes a landmarker that watches a webcam feed, detects signs, and classifies them against a database of known signs.

```ts
import {
    createLandmarker,
    createClassificationWorker,
    createRecognizeHandler,
    onClassificationResult,
    SignMap,
    isValidMapData,
} from "sign-language-recognition";
import type { Sign, SignMapEntry } from "sign-language-recognition";

// Load your sign database (array of SignMapEntry objects).
// Pass an empty SignMap() if you have no pre-existing database.
const response = await fetch("/MappingDatabase.json");
const mappingDatabase: SignMapEntry[] = JSON.parse(await response.text());
const signDb = isValidMapData(mappingDatabase) ? new SignMap(mappingDatabase) : new SignMap();

// Initialize the landmarker with served paths to the WASM runtime and model task files.
// Note that these paths are transformed by Vite.
// In reality, these directories were placed in the public folder for the Vite project.
const landmarker = await createLandmarker({
    wasmPath: "/wasm",
    handTaskPath: "/tasks/hand_landmarker.task",
    poseTaskPath: "/tasks/pose_landmarker_lite.task",
});

// Spin up the classification web worker.
const classificationWorker = createClassificationWorker(
    new URL("sign-language-recognition/worker", import.meta.url)
);
classificationWorker.postMessage({ type: "init", database: signDb.map });

// Listen for classification results.
onClassificationResult(classificationWorker, ({ word, distance }) => {
    console.log("recognized:", word, "distance:", distance);
});

// Start watching the webcam. Pass a <video> and <canvas> element.
// The callback fires each time a complete sign gesture is detected.
const recognize = createRecognizeHandler(classificationWorker);
landmarker.watchWebcam(videoElement, canvasElement, (sign: Sign) => {
    recognize(sign); // sends the sign to the worker for classification
});

// To add a new sign to the database at runtime:
signDb.addSignToMap({ vectors: sign.vectors, word: "hello" });
classificationWorker.postMessage({ type: "init", database: signDb.map });

// To export the updated database as JSON:
const json = JSON.stringify(signDb.map);
```


## How to push changes

- Fork your own copy of the repo
- Make your changes
- Push them to your fork
- Create a pull request