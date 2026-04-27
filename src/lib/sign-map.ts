import type {Sign} from "./landmark-detection.ts";
import {dtwDistance, type SignMapEntry} from "./util.ts";

const unknownSign = "{???}"

export class SignMap {
    #vectorToWordMap: SignMapEntry[] = [];

    constructor(embeddingToWordMap?: SignMapEntry[]) {
        this.#vectorToWordMap = embeddingToWordMap ?? [];
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
        return this.#vectorToWordMap;
    }

    // adds sign to database
    addSignToMap(sign: Sign) {
        if (sign.word === null) {
            throw new Error("Cannot add sign to database without word");
        }

        this.#vectorToWordMap.push({embedding: {vectors: sign.vectors}, word: sign.word});
    }
}
