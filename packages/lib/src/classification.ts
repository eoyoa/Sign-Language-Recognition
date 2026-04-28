import type { Sign } from "./landmark-detection";

export type ClassificationResult = { word: string; distance: number };

export function createClassificationWorker(workerUrl: string | URL): Worker {
    return new Worker(workerUrl, { type: "module" });
}

export function createRecognizeHandler(worker: Worker): (sign: Sign) => void {
    return (sign) => {
        worker.postMessage({ type: "recognize", sign });
    };
}

export function onClassificationResult(
    worker: Worker,
    callback: (result: ClassificationResult) => void
): void {
    worker.onmessage = (e: MessageEvent<{ type: "result" } & ClassificationResult>) => {
        if (e.data.type === "result") {
            callback({ word: e.data.word, distance: e.data.distance });
        }
    };
}
