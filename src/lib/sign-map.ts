import type {Frame, Sign, SignData} from "./hand-landmarking.ts";
import DynamicTimeWarping from "dynamic-time-warping";

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

function euclidianDistance(a: Frame, b: Frame): number {
    const hands = Math.min(a.length, b.length);
    const penalty = Math.abs(a.length - b.length);

    let total = 0;
    for (let i = 0; i < hands; i++) {
        const handA = a[i];
        const handB = b[i];
        const n = Math.min(handA.length, handB.length);
        for (let j = 0; j < n; j++) {
            const diffx = handA[j].x - handB[j].x;
            const diffy = handA[j].y - handB[j].y;
            const diffz = handA[j].z - handB[j].z;
            total += Math.sqrt(diffx * diffx + diffy * diffy + diffz * diffz);

        }
    }
    return total + penalty;
}

function dtwDistance(a: SignData, b: SignData): number {
    const n = a.frames.length;
    const m = b.frames.length;
    if (n === 0 || m === 0) return Infinity;

    const dtw = new DynamicTimeWarping(a.frames, b.frames, euclidianDistance);
    return dtw.getDistance() / (n + m);
}

export function isValidMapData(data: unknown): data is SignMapEntry[] {
    return Array.isArray(data) && data.every(entry => typeof entry === "object" && entry !== null && "embedding" in entry && "word" in entry);
}

export const unknownSign = "{???}"

export interface SignMapEntry {
    embedding: SignData,
    word: string,
}

export class SignMap {
    #embeddingToWordMap: SignMapEntry[] = [];

    constructor(embeddingToWordMap?: SignMapEntry[]) {
        this.#embeddingToWordMap = embeddingToWordMap ?? [];
    }

    // given sign data, return the ASL gloss for that data
    recognizeSign(sign: Sign) {
        let bestWord = unknownSign;
        let bestDistance = Infinity;
        for (const entry of this.map) {
            const distance = dtwDistance(sign, entry.embedding);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestWord = entry.word;
            }
        }
        sign.word = bestWord;
        console.log("sign:", sign, "distance:", bestDistance);
    }

    get map(): SignMapEntry[] {
        return this.#embeddingToWordMap;
    }

    // adds sign to database
    addSignToMap(sign: Sign) {
        if (sign.word === null) {
            throw new Error("Cannot add sign to database without word");
        }

        this.#embeddingToWordMap.push({embedding: {frames: sign.frames}, word: sign.word});
    }
}
