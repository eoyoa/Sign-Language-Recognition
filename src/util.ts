import type { SignData } from "./landmark-detection";
import { DB_VERSION } from "./version";

export function throwNull(msg: string): never {
    throw new Error(msg);
}

export function isValidMapData(data: unknown): data is SignMapEntry[] {
    return Array.isArray(data) && data.every(entry => typeof entry === "object" && entry !== null && "embedding" in entry && "word" in entry);
}

export function isDatabaseVersionCompatible(file: MappingDatabaseFile): boolean {
    const [fileMajor] = file.version.split(".");
    const [pkgMajor] = DB_VERSION.split(".");
    return fileMajor === pkgMajor;
}

export function isValidDatabaseFile(data: unknown): data is MappingDatabaseFile {
    return (
        typeof data === "object" &&
        data !== null &&
        "version" in data &&
        typeof (data as Record<string, unknown>).version === "string" &&
        "mappings" in data &&
        isValidMapData((data as Record<string, unknown>).mappings)
    );
}

export interface SignMapEntry {
    embedding: SignData,
    word: string,
}

export interface MappingDatabaseFile {
    version: string,
    mappings: SignMapEntry[],
}
