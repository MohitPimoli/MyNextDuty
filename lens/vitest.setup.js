import "@testing-library/jest-dom";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// Extend expect with jest-axe's accessibility matcher.
expect.extend(toHaveNoViolations);
