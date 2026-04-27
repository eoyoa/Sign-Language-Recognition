import type { SignData } from "./landmark-detection.ts";

export function throwNull(msg: string): never {
    throw new Error(msg);
}

export function isValidMapData(data: unknown): data is SignMapEntry[] {
    return Array.isArray(data) && data.every(entry => typeof entry === "object" && entry !== null && "embedding" in entry && "word" in entry);
}

export interface SignMapEntry {
    embedding: SignData,
    word: string,
}
