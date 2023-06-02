import { getRandomRGB } from "../../../src/utils/botUtil";

describe("getRandomRGB", () => {
  test("should return an array with three numbers between 0 and 255", () => {
    const rgb = getRandomRGB();
    expect(Array.isArray(rgb)).toBe(true);
    expect(rgb.length).toBe(3);
    expect(rgb[0]).toBeGreaterThanOrEqual(0);
    expect(rgb[0]).toBeLessThanOrEqual(255);
    expect(rgb[1]).toBeGreaterThanOrEqual(0);
    expect(rgb[1]).toBeLessThanOrEqual(255);
    expect(rgb[2]).toBeGreaterThanOrEqual(0);
    expect(rgb[2]).toBeLessThanOrEqual(255);
  });
});
