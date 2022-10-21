import { v4 as uuidv4 } from "uuid";

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
