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
    updateDb,
    createRecognizeHandler,
    onClassificationResult,
    SignMap,
    isValidDatabaseFile,
    isDatabaseVersionCompatible,
} from "sign-language-recognition";
import type { Sign, MappingDatabaseFile } from "sign-language-recognition";

// Load your sign database from a versioned MappingDatabase.json file.
// Pass an empty SignMap() if you have no pre-existing database.
const response = await fetch("/MappingDatabase.json");
const mappingDatabase: MappingDatabaseFile = JSON.parse(await response.text());
const signDb =
    isValidDatabaseFile(mappingDatabase) && isDatabaseVersionCompatible(mappingDatabase)
        ? new SignMap(mappingDatabase.mappings)
        : new SignMap();

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
    new URL("sign-language-recognition/worker", import.meta.url),
    signDb.map
);

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
updateDb(classificationWorker, signDb.map);

// To export the updated database as JSON:
const file: MappingDatabaseFile = { version: "1.0", mappings: signDb.map };
const json = JSON.stringify(file, null, 2);
```


## MappingDatabase.json format

The sign database file uses a versioned JSON format:

```json
{
  "version": "1.0",
  "mappings": [
    { "embedding": { "vectors": [...] }, "word": "hello" }
  ]
}
```

- `version` — `"major.minor"` string, tracking the major and minor version of the library that wrote the file. Patch versions never affect the schema and are omitted.
  - Bump **major** on breaking changes (fields removed, structure restructured). Readers should reject files with an unrecognised major version.
  - Bump **minor** on backwards-compatible additions (new optional fields). Old readers can still load the file safely.
- `mappings` — array of `SignMapEntry` objects, each with an `embedding` (`SignData`) and a `word` label.

An empty database on disk looks like:

```json
{ "version": "1.0", "mappings": [] }
```

Use `isValidDatabaseFile` to validate the structure of a parsed JSON value, and `isDatabaseVersionCompatible` to confirm the file's major version matches the installed library before constructing a `SignMap`:

```ts
import { isValidDatabaseFile, isDatabaseVersionCompatible, SignMap } from "sign-language-recognition";
import type { MappingDatabaseFile } from "sign-language-recognition";

const data: unknown = JSON.parse(rawJson);

if (!isValidDatabaseFile(data)) {
    console.error("File is not a valid MappingDatabaseFile.");
} else if (!isDatabaseVersionCompatible(data)) {
    console.error(`Database version ${data.version} is incompatible with this version of the library.`);
} else {
    const signDb = new SignMap(data.mappings);
}
```

`isDatabaseVersionCompatible` compares only the **major** version component. A file written by a library with a different major version may have breaking structural changes and should be rejected. Minor-version differences are backwards-compatible and are accepted.

---

## How to push changes

- Fork your own copy of the repo
- Make your changes
- Push them to your fork
- Create a pull request