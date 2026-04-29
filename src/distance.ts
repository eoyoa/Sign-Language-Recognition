import type {HandsData, SignData} from "./landmark-detection";
import type {FeatureVector} from "./feature-vector";
import {SHOULDER_DATA_LENGTH} from "./feature-vector";
import DynamicTimeWarping from "dynamic-time-warping";

const MISSING_HAND_PENALTY = 1000;

function featureVectorDistance(a: HandsData, b: HandsData): number {
    let diff = 0;
    for (const side of ["left", "right"] as const) {
        const handA = a[side], handB = b[side];
        if (!handA && !handB) continue;
        if (!handA || !handB) {
            diff += MISSING_HAND_PENALTY;
            continue;
        }
        const n = Math.min(handA.length, handB.length);
        for (let i = 0; i < n; i++) {
            const distance = Math.abs(handA[i] - handB[i]);
            diff += Math.exp(distance) - 1;
        }
    }
    return diff;
}

/**
 * Swaps the left-shoulder and right-shoulder tail blocks within a feature vector.
 * Needed when mirroring handedness: what was the ipsilateral shoulder becomes
 * the contralateral one, so the two 3-value blocks at the end must be exchanged.
 */
function swapShoulderBlocks(fv: FeatureVector): FeatureVector {
    const result = fv.slice();
    const len = result.length;
    const half = SHOULDER_DATA_LENGTH / 2; // 3 values per shoulder
    for (let i = 0; i < half; i++) {
        const leftIdx = len - SHOULDER_DATA_LENGTH + i;
        const rightIdx = len - half + i;
        [result[leftIdx], result[rightIdx]] = [result[rightIdx], result[leftIdx]];
    }
    return result;
}

/**
 * Returns a copy of `sign` with left/right hands swapped and the shoulder-distance
 * blocks within each feature vector also swapped to match the new handedness.
 */
function swapHandedness(sign: SignData): SignData {
    return {
        vectors: sign.vectors.map(f => ({
            left: f.right ? swapShoulderBlocks(f.right) : undefined,
            right: f.left ? swapShoulderBlocks(f.left) : undefined,
        })),
    };
}

export function dtwDistance(a: SignData, b: SignData): number {
    const n = a.vectors.length;
    const m = b.vectors.length;
    if (n === 0 || m === 0) return Infinity;

    const normalDist = new DynamicTimeWarping(a.vectors, b.vectors, featureVectorDistance).getDistance();
    const swappedDist = new DynamicTimeWarping(a.vectors, swapHandedness(b).vectors, featureVectorDistance).getDistance();
    return Math.min(normalDist, swappedDist) / (n + m);
}
