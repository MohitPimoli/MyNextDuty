import { describe, it, expect } from "vitest";
import { cn } from "@/util/cn";

describe("cn()", () => {
    it("joins multiple class strings", () => {
        expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
    });

    it("de-duplicates conflicting Tailwind utilities (last wins)", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
        expect(cn("text-text-primary", "text-text-secondary")).toBe(
            "text-text-secondary"
        );
    });

    it("handles conditional (object) class values", () => {
        expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });

    it("handles array inputs", () => {
        expect(cn(["px-2", "py-2"], "gap-2")).toBe("px-2 py-2 gap-2");
    });

    it("ignores falsy values", () => {
        expect(cn("base", null, undefined, false, "", "extra")).toBe("base extra");
    });

    it("returns an empty string when given no meaningful input", () => {
        expect(cn()).toBe("");
        expect(cn(null, undefined, false)).toBe("");
    });
});
