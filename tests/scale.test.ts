import { describe, expect, test } from "bun:test";
import { scale } from "../src/scale.mjs";

describe("scale", () => {
    test("正值返回 calc 表达式", () => {
        expect(scale(100)).toBe("calc(100 * var(--tw-scale))");
    });

    test("负值返回 calc 表达式", () => {
        expect(scale(-20)).toBe("calc(-20 * var(--tw-scale))");
    });

    test("零值返回 '0'", () => {
        expect(scale(0)).toBe("0");
    });

    test("自定义变量名", () => {
        expect(scale(100, "--my-scale")).toBe("calc(100 * var(--my-scale))");
    });
});
