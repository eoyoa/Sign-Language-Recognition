import type { SignData } from "./landmark-detection";
export declare function throwNull(msg: string): never;
export declare function isValidMapData(data: unknown): data is SignMapEntry[];
export interface SignMapEntry {
    embedding: SignData;
    word: string;
}
