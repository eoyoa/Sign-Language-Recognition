import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8")) as { version: string };

export default defineConfig({
    define: {
        __PACKAGE_VERSION__: JSON.stringify(version),
    },
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
