/*
Todo:
 - Make data persistant
 - auto flush to data structure
    - add text field in react
 - Import from youtube link (optional)
*/





import type {Sign, SignData} from "./hand-landmarking.ts";
import * as fs from 'fs';

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

interface SignMapEntry {
    embedding: SignData,
    word: string,
}

export class SignMap {
    #embeddingToWordMap: SignMapEntry[] = [];

    constructor(embeddingToWordMap?: SignMapEntry[]) {
        if (embeddingToWordMap) {
            this.#embeddingToWordMap = embeddingToWordMap;
        }
    }

    // given sign data, return the ASL gloss for that data
    recognizeSign(sign: Sign) {
        // TODO: run DTW on sign data
        // TODO: assign sign.word
        sign.word = unknownSign;
        console.log("sign:", sign);
    }

    // adds sign to database
    addSignToDatabase(sign: Sign) {
        if (sign.word === null) {
            throw new Error("Cannot add sign to database without word");
        }
    
        // push to instance database
        this.#embeddingToWordMap.push({embedding: {frames: sign.frames}, word: sign.word})
        // push to persistant database
        try {
            // Convert array to a formatted JSON string (4-space indentation)
            const jsonString = JSON.stringify(this.#embeddingToWordMap, null, 4);
            
            // Write to the file
            fs.writeFileSync('src/MappingDatabase.json', jsonString, 'utf8');
            console.log('Successfully updated database!');
        } catch (err) {
            console.error('Error updating database:', err);
        }

    }
}

export type SignDatabaseFunction = SignMap["recognizeSign"] | SignMap["addSignToDatabase"]