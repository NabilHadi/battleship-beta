import { ship } from "./ship";
import { describe, test, expect } from "@jest/globals";

describe("Ship", () => {
  test("Object has correct length", () => {
    let s = ship(3);
    let s1 = ship(6);
    expect(s.length).toBe(3);
    expect(s1.length).toBe(6);
  });

  test("Object returns correct number of hits", () => {
    let s = ship(3);
    expect(s.numOfHits).toBe(0);
    s.hit();
    expect(s.numOfHits).toBe(1);
    s.hit();
    s.hit();
    expect(s.numOfHits).toBe(3);
  });

  test("Object returns correct sunk state", () => {
    let s = ship(3);
    expect(s.isSunk()).toBe(false);
    s.hit();
    expect(s.isSunk()).toBe(false);
    s.hit();
    expect(s.isSunk()).toBe(false);
    s.hit();
    expect(s.isSunk()).toBe(true);
  });
});
