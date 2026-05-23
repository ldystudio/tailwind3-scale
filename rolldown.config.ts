import { defineConfig } from "rolldown";

const removeCommentsPlugin = {
    name: "remove-comments",
    renderChunk(code: string) {
        return code
            .replace(/\/\*(?!\s*@__(?:PURE|NO_SIDE_EFFECTS)__\s*\*\/)[\s\S]*?\*\//g, "")
            .replace(/\/\/#region.*\n?/g, "")
            .replace(/\/\/#endregion\n?/g, "")
            .replace(/\n{3,}/g, "\n\n");
    },
};

export default defineConfig([
    {
        input: "src/plugin.cjs",
        external: ["tailwindcss/plugin"],
        output: {
            file: "dist/plugin.cjs",
            format: "cjs",
            exports: "auto",
        },
        plugins: [removeCommentsPlugin],
    },
    {
        input: "src/scale.cjs",
        output: {
            file: "dist/scale.cjs",
            format: "cjs",
            exports: "auto",
        },
        plugins: [removeCommentsPlugin],
    },
    {
        input: "src/scale.mjs",
        output: {
            file: "dist/scale.mjs",
            format: "esm",
        },
        plugins: [removeCommentsPlugin],
    },
]);
