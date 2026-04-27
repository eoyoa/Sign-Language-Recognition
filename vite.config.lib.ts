import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/lib/index.ts"),
                worker: resolve(__dirname, "src/workers/classification.worker.ts"),
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: ["@mediapipe/tasks-vision", "dynamic-time-warping", "numpy-ts"],
        },
    },
});
