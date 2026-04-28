import type { Sign } from "./landmark-detection";
import type { SignMapEntry } from "./util";
export declare class SignMap {
    #private;
    constructor(embeddingToWordMap?: SignMapEntry[]);
    recognizeSign(sign: Sign): void;
    get map(): SignMapEntry[];
    addSignToMap(sign: Sign): void;
}
