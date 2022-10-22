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
    chooseCoordinates(enemyGameboard) {
      let coords = getRandomCoordinates(9);
      while (enemyGameboard.getSquareAt(coords.x, coords.y).isAttacked) {
        coords = getRandomCoordinates(9);
      }

      return coords;
    },
  };
}
