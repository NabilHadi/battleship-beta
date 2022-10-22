import { computerPlayer, player } from "./player";
import { describe, test, expect } from "@jest/globals";
import { gameboard } from "./gameboard";
import { ship } from "./ship";

describe("Player", () => {
  test("Object should have an id and name", () => {
    let p = player("hello world");
    expect(p.id).toBeDefined();
    expect(p.name).toBe("hello world");

    let p2 = player("hi");
    expect(p2.id).toBeDefined();
    expect(p2.name).toBe("hi");
  });

  test("Objects should have diffrent ids", () => {
    let p = player("test");
    let p2 = player("test2");
    let p3 = player("test");

    expect(p.id).not.toEqual(p2.id);
    expect(p3.id).not.toEqual(p.id);
  });

  describe("Computer Player", () => {
    test("chooseCoordinates function should return correct coordinates", () => {
      let cmP = computerPlayer();
      let g = gameboard(9, ship);

      let coords = cmP.chooseCoordinates(g);
      expect(g.getSquareAt(coords.x, coords.y)).toBeDefined();
    });
  });
});
