import { gameboard } from "./gameboard";
import { ship } from "./ship";
import { describe, test, expect, jest } from "@jest/globals";

describe("Gameboard", () => {
  test("Creates board with correct length", () => {
    let g = gameboard(9);
    expect(g.board[0][0]).toBeDefined();
    expect(g.board[5][5]).toBeDefined();
    expect(g.board[0][9]).not.toBeDefined();
    expect(g.board[9]).not.toBeDefined();
  });

  test("Creates Board with correct intial properties", () => {
    let g = gameboard(9);
    for (let i = 0; i < g.board.length; i++) {
      for (let j = 0; j < g.board[i].length; j++) {
        expect(g.board[i][j].ship).toBeNull();
        expect(g.board[0][0].isAttacked).toBe(false);
      }
    }
  });

  test("Calling placeShipAt should call ship factory function", () => {
    const fakeShipFactory = jest.fn();

    let g = gameboard(9, fakeShipFactory);
    g.placeShipAt([0, 0], [0, 1], [0, 2]);
    expect(fakeShipFactory).toBeCalledWith(3);
  });

  test("Calling placeShipAt function should update board state", () => {
    let g = gameboard(9, ship);
    g.placeShipAt([0, 0], [0, 1], [0, 2]);
    expect(g.board[0][0].ship).toBeDefined();
    expect(g.board[0][1].ship).toBeDefined();
    expect(g.board[0][2].ship).toBeDefined();
    expect(g.board[1][1].ship).toBeNull();
    expect(g.board[0][3].ship).toBeNull();
  });

  test("Calling receiveAttack function should update board state", () => {
    let g = gameboard(9, ship);
    expect(g.board[0][0].isAttacked).toBe(false);
    g.receiveAttack(0, 0);
    expect(g.board[0][0].isAttacked).toBe(true);
    expect(g.board[1][1].isAttacked).toBe(false);
    g.receiveAttack(1, 1);
    expect(g.board[1][1].isAttacked).toBe(true);
  });

  test("Calling receiveAttack function should determine if attack hit a ship", () => {
    let g = gameboard(9, ship);
    g.placeShipAt([1, 1], [1, 2]);
    expect(g.receiveAttack(1, 3)).toBe(false);
    expect(g.receiveAttack(1, 1)).toBe(true);
  });

  test("attacking a ship should update ship state", () => {
    let g = gameboard(9, ship);

    g.placeShipAt([1, 1], [1, 2]);
    expect(g.board[1][1].ship.numOfHits).toBe(0);
    expect(g.board[1][2].ship.numOfHits).toBe(0);

    g.receiveAttack(1, 1);
    expect(g.board[1][1].ship.numOfHits).toBe(1);
    expect(g.board[1][2].ship.numOfHits).toBe(1);

    g.receiveAttack(1, 2);
    expect(g.board[1][1].ship.numOfHits).toBe(2);
    expect(g.board[1][2].ship.numOfHits).toBe(2);

    expect(g.board[1][1].ship.isSunk()).toBe(true);
    expect(g.board[1][2].ship.isSunk()).toBe(true);
  });

  test("attacking a ship should update board state", () => {
    let g = gameboard(9, ship);

    g.placeShipAt([1, 1], [1, 2]);
    expect(g.board[1][1].isAttacked).toBe(false);

    g.receiveAttack(1, 1);
    expect(g.board[1][1].isAttacked).toBe(true);
  });

  test("Should return correct isAllShipsSunk result", () => {
    let g = gameboard(9, ship);
    expect(g.isAllShipsSunk()).toBe(true);

    g.placeShipAt([2, 2], [3, 2]);
    expect(g.isAllShipsSunk()).toBe(false);

    g.receiveAttack(2, 2);
    expect(g.isAllShipsSunk()).toBe(false);

    g.receiveAttack(3, 2);
    expect(g.isAllShipsSunk()).toBe(true);
  });
});
