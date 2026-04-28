import type { Sign } from "./landmark-detection";
import type { SignMapEntry } from "./util";
export type ClassificationResult = {
    word: string;
    distance: number;
};
export declare function updateDb(worker: Worker, database: SignMapEntry[]): void;
export declare function createClassificationWorker(workerUrl: string | URL, database: SignMapEntry[]): Worker;
export declare function createRecognizeHandler(worker: Worker): (sign: Sign) => void;
export declare function onClassificationResult(worker: Worker, callback: (result: ClassificationResult) => void): void;
