import { describe, expect, test } from "bun:test";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

const tailwind3Scale = require("../src/plugin.cjs");

async function buildCss(classes: string, pluginEntry = tailwind3Scale()) {
    const result = await postcss([
        tailwindcss({
            content: [{ raw: `<div class="${classes}"></div>` }],
            corePlugins: { preflight: false },
            plugins: [pluginEntry],
        }),
    ]).process("@tailwind base; @tailwind utilities;", { from: undefined });

    return result.css;
}

describe("tailwind3Scale plugin", () => {
    test("注入默认缩放变量和 iOS 13 fallback", async () => {
        const css = await buildCss("w-s-100");

        expect(css).toContain("--tw-scale: 0.0625rem");
        expect(css).toContain("--tw-viewport-font-size: 4.26667vw");
        expect(css).toContain("font-size: var(--tw-viewport-font-size)");
        expect(css).toContain("@supports (font-size: clamp(1px, 2vw, 3px))");
    });

    test("生成常用正值工具类", async () => {
        const css = await buildCss("w-s-100 h-s-44 px-s-16 text-s-14 size-s-20");

        expect(css).toContain(".w-s-100");
        expect(css).toContain("width: calc(var(--tw-scale) * 100)");
        expect(css).toContain("height: calc(var(--tw-scale) * 44)");
        expect(css).toContain("padding-left: calc(var(--tw-scale) * 16)");
        expect(css).toContain("padding-right: calc(var(--tw-scale) * 16)");
        expect(css).toContain("font-size: calc(var(--tw-scale) * 14)");
    });

    test("生成负值工具类", async () => {
        const css = await buildCss("-mt-s-10 -translate-x-s-20");

        expect(css).toContain(".-mt-s-10");
        expect(css).toContain("margin-top: calc(var(--tw-scale) * -10)");
        expect(css).toContain("--tw-translate-x: calc(var(--tw-scale) * -20)");
        expect(css).toContain("transform: translate(var(--tw-translate-x), var(--tw-translate-y))");
    });

    test("支持任意值语法", async () => {
        const css = await buildCss("w-s-[137] text-s-[13.5]");

        expect(css).toContain(".w-s-\\[137\\]");
        expect(css).toContain("width: calc(var(--tw-scale) * 137)");
        expect(css).toContain("font-size: calc(var(--tw-scale) * 13.5)");
    });

    test("支持自定义设计稿宽度", async () => {
        const css = await buildCss("w-s-100", tailwind3Scale({ designWidth: 390 }));

        expect(css).toContain("--tw-viewport-font-size: 4.10256vw");
    });

    test("不调用插件工厂也能工作", async () => {
        const css = await buildCss("w-s-100", tailwind3Scale);

        expect(css).toContain(".w-s-100");
        expect(css).toContain("width: calc(var(--tw-scale) * 100)");
    });

    test("支持局部 scope，不覆盖全局 html 字号", async () => {
        const css = await buildCss(
            "tw-scale-scope w-s-375",
            tailwind3Scale({ rootFontSize: 12, scopeSelector: ".tw-scale-scope" })
        );

        expect(css).toContain(".tw-scale-scope");
        expect(css).toContain("--tw-scale: calc(var(--tw-viewport-font-size) * 0.08333)");
        expect(css).toContain(
            "--tw-scale: clamp(calc(var(--tw-viewport-font-size-min) * 0.08333), calc(var(--tw-viewport-font-size) * 0.08333), calc(var(--tw-viewport-font-size-max) * 0.08333))"
        );
        expect(css).toContain("font-size: var(--tw-viewport-font-size)");
        expect(css).not.toContain("html {");
    });
});
