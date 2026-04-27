import { dtwDistance, type SignMapEntry } from "../lib/util.ts";
import type { SignData } from "../lib/landmark-detection.ts";

type InMsg =
    | { type: "init"; database: SignMapEntry[] }
    | { type: "recognize"; sign: SignData };

type OutMsg =
    | { type: "result"; word: string; distance: number };

let database: SignMapEntry[] = [];

self.onmessage = (e: MessageEvent<InMsg>) => {
    if (e.data.type === "init") {
        database = e.data.database;
    } else if (e.data.type === "recognize") {
        const { sign } = e.data;
        let bestWord = "{???}", bestDistance = Infinity;
        for (const entry of database) {
            const d = dtwDistance(sign, entry.embedding);
            if (d < bestDistance) { bestDistance = d; bestWord = entry.word; }
        }
        self.postMessage({ type: "result", word: bestWord, distance: bestDistance } satisfies OutMsg);
    }
};
