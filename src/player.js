import { v4 as uuidv4 } from "uuid";
import { getRandomCoordinates } from "./gameUtils";

export function player(name) {
  let gameboard;

  return {
    id: uuidv4(),
    name,
    setGameboard(_gameboard) {
      this.gameboard = _gameboard;
    },
    gameboard,
  };
}

export function computerPlayer() {
  let proto = player("computer");

  return {
    ...proto,
    nextMoves: [],
    chooseCoordinates(canAttackFunc) {
      let coords = this.nextMoves.pop();
      if (!coords) coords = getRandomCoordinates(9);
      while (!canAttackFunc(coords.x, coords.y)) {
        coords = this.nextMoves.pop();
        if (!coords) coords = getRandomCoordinates(9);
      }

      return coords;
    },
    chooseAdjacentCoordinates({ x, y }, canAttackFunc) {
      if (canAttackFunc(x + 1, y)) {
        this.nextMoves.push({ x: x + 1, y });
      }
      if (canAttackFunc(x - 1, y)) {
        this.nextMoves.push({ x: x - 1, y });
      }
      if (canAttackFunc(x, y - 1)) {
        this.nextMoves.push({ x, y: y - 1 });
      }
      if (canAttackFunc(x, y + 1)) {
        this.nextMoves.push({ x, y: y + 1 });
      }
    },
  };
}
