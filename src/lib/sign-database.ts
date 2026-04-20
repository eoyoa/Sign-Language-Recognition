import type {Sign} from "./hand-landmarking.ts";

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

export const unknownSign = "{???}"

export class SignDatabase {
    // TODO: somebody add underlying data structure

    constructor() {
        // TODO: when you make the underlying data structure, probably construct it here
    }

    // given sign data, return the ASL gloss for that data
    recognizeSign(sign: Sign) {
        // TODO: run DTW on sign data
        // TODO: assign sign.word
        sign.word = unknownSign;
        console.log("sign:", sign)
    }

    // adds sign to database
    addSignToDatabase(sign: Sign) {
        if (sign.word === null) {
            throw new Error("Cannot add sign to database without word");
        }

        // TODO: add sign with word to associative database
    }
}

export type SignDatabaseFunction = SignDatabase["recognizeSign"] | SignDatabase["addSignToDatabase"]