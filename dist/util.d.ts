import type { SignData } from "./landmark-detection";
export declare function throwNull(msg: string): never;
export declare function isValidMapData(data: unknown): data is SignMapEntry[];
export declare function isDatabaseVersionCompatible(file: MappingDatabaseFile): boolean;
export declare function isValidDatabaseFile(data: unknown): data is MappingDatabaseFile;
export interface SignMapEntry {
    embedding: SignData;
    word: string;
}
export interface MappingDatabaseFile {
    version: string;
    mappings: SignMapEntry[];
}
