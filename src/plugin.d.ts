import type { Config } from "tailwindcss";

declare namespace tailwind3Scale {
    interface Options {
        designWidth?: number;
        minWidth?: number;
        maxWidth?: number;
        rootFontSize?: number;
        max?: number;
        cssVar?: string;
        viewportFontSizeVar?: string;
        includeClamp?: boolean;
        scopeSelector?: string | null;
        scaleCoreUtilities?: boolean;
    }
}

declare function tailwind3Scale(options?: tailwind3Scale.Options): NonNullable<Config["plugins"]>[number];

export = tailwind3Scale;
