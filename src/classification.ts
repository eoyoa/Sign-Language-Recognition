import type { Sign } from "./landmark-detection";
import type { SignMapEntry } from "./util";

export type ClassificationResult = { word: string; distance: number };

export function updateDb(worker: Worker, database: SignMapEntry[]): void {
    worker.postMessage({ type: "updateDb", database });
}

export function createClassificationWorker(workerUrl: string | URL, database: SignMapEntry[]): Worker {
    const worker = new Worker(workerUrl, { type: "module" });
    updateDb(worker, database);
    return worker;
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
