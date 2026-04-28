import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8")) as { version: string };

export default defineConfig({
    define: {
        __PACKAGE_VERSION__: JSON.stringify(version),
    },
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/index.ts"),
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: ["@mediapipe/tasks-vision", "dynamic-time-warping", "numpy-ts"],
        },
    },
});
