import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.js"],
    },
    resolve: {
        alias: {
            // Mirror next.config.mjs: @/ points to the project root (lens/)
            "@": __dirname,
        },
    },
});
