import type { HandsData, SignData } from "./landmark-detection";
import DynamicTimeWarping from "dynamic-time-warping";

const MISSING_HAND_PENALTY = 1000;

function featureVectorDistance(a: HandsData, b: HandsData): number {
    let diff = 0;
    for (const side of ["left", "right"] as const) {
        const handA = a[side], handB = b[side];
        if (!handA && !handB) continue;
        if (!handA || !handB) { diff += MISSING_HAND_PENALTY; continue; }
        const n = Math.min(handA.length, handB.length);
        for (let i = 0; i < n; i++) diff += Math.abs(handA[i] - handB[i]);
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
