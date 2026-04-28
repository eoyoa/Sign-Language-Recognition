import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: false,
        lib: {
            entry: resolve(__dirname, "src/workers/classification.worker.ts"),
            fileName: "worker",
            formats: ["es"],
        },
        rollupOptions: {
            // Bundle all dependencies inline so the worker is self-contained.
            // dynamic-time-warping must not be external here because browsers
            // cannot resolve bare specifiers in worker modules.
            external: [],
        },
    },
});
