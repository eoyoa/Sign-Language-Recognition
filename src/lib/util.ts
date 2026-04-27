/**
 * 2 ppl: recognize sign (implement DTW/find DTW lib online/ask claude)
 * - elene
 * - julian
 * 2 ppl: add sign to associative list (make associative list struct/find some sort of way to make this persistent)
 * - david
 * - duc
 * 2 ppl: find llm model and try transformers.js
 * - maral
 * - linh
 */
import type {SignData} from "./hand-landmarking.ts";
import DynamicTimeWarping from "dynamic-time-warping";
import type {FeatureVector} from "./feature-vector.ts";

// function euclidianDistance(a: Frame, b: Frame): number {
//     const hands = Math.min(a.length, b.length);
//     const penalty = Math.abs(a.length - b.length);
//
//     let total = 0;
//     for (let i = 0; i < hands; i++) {
//         const handA = a[i];
//         const handB = b[i];
//         const n = Math.min(handA.length, handB.length);
//         for (let j = 0; j < n; j++) {
//             const diffx = handA[j].x - handB[j].x;
//             const diffy = handA[j].y - handB[j].y;
//             const diffz = handA[j].z - handB[j].z;
//             total += Math.sqrt(diffx * diffx + diffy * diffy + diffz * diffz);
//
//         }
//     }
//     return total + penalty;
// }

function featureVectorDistance(a: FeatureVector, b: FeatureVector): number {
    let diff = 0;
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) {
        diff += Math.abs(a[i] - b[i]);
    }
    return diff;
}

export function dtwDistance(a: SignData, b: SignData): number {
    const n = a.vectors.length;
    const m = b.vectors.length;
    if (n === 0 || m === 0) return Infinity;

    const dtw = new DynamicTimeWarping(a.vectors, b.vectors, featureVectorDistance);
    return dtw.getDistance() / (n + m);
}

export function isValidMapData(data: unknown): data is SignMapEntry[] {
    return Array.isArray(data) && data.every(entry => typeof entry === "object" && entry !== null && "embedding" in entry && "word" in entry);
}

export interface SignMapEntry {
    embedding: SignData,
    word: string,
}