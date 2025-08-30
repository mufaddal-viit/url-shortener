// __tests__/math.test.js
const { add, multiply } = require("../utils/math");

describe("Math Utilities", () => {
  test("adds two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test("multiplies two numbers correctly", () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-1, 4)).toBe(-4);
  });
});
