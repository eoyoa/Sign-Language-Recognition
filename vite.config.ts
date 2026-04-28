import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
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
