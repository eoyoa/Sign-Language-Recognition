import type { Sign } from "./landmark-detection";
export type ClassificationResult = {
    word: string;
    distance: number;
};
export declare function createClassificationWorker(workerUrl: string | URL): Worker;
export declare function createRecognizeHandler(worker: Worker): (sign: Sign) => void;
export declare function onClassificationResult(worker: Worker, callback: (result: ClassificationResult) => void): void;
