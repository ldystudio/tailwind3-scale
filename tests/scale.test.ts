import { describe, expect, test } from "bun:test";
import { scale, scaleInt } from "../src/scale.mjs";

describe("scale", () => {
    test("正值返回 calc 表达式", () => {
        expect(scale(100)).toBe("calc(var(--tw-scale) * 100)");
    });

    test("负值返回 calc 表达式", () => {
        expect(scale(-20)).toBe("calc(var(--tw-scale) * -20)");
    });

    test("零值返回 '0'", () => {
        expect(scale(0)).toBe("0");
    });

    test("自定义变量名", () => {
        expect(scale(100, "--my-scale")).toBe("calc(var(--my-scale) * 100)");
    });
});

describe("scaleInt", () => {
    test("默认按设计稿宽度返回同等整数 px", () => {
        expect(scaleInt(100)).toBe(100);
    });

    test("指定视口宽度时按 scale 等效比例取整", () => {
        expect(scaleInt(100, { viewportWidth: 390 })).toBe(104);
    });

    test("视口宽度低于最小宽度时使用 minWidth", () => {
        expect(scaleInt(100, { viewportWidth: 300 })).toBe(85);
    });

    test("视口宽度高于最大宽度时使用 maxWidth", () => {
        expect(scaleInt(100, { viewportWidth: 500 })).toBe(128);
    });

    test("支持负值和零值", () => {
        expect(scaleInt(-20, { viewportWidth: 390 })).toBe(-21);
        expect(scaleInt(0, { viewportWidth: 390 })).toBe(0);
    });

    test("支持自定义设计稿和边界配置", () => {
        expect(scaleInt(100, { designWidth: 750, minWidth: 640, maxWidth: 960, viewportWidth: 828 })).toBe(110);
    });
});
