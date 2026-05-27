import { describe, expect, test } from "bun:test";
import { scale } from "../src/scale.mjs";

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
