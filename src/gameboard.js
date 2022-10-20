export function gameboard(size, shipFactory) {
  let board = [];
  for (let x = 0; x < size; x++) {
    board.push([]);
    for (let y = 0; y < size; y++) {
      board[x].push({ ship: null, isAttacked: false });
    }
  }

  function placeShipAt(...coordinates) {
    const s = shipFactory(coordinates.length);
    coordinates.forEach(([x, y]) => {
      board[x][y].ship = s;
    });
  }

  function receiveAttack(x, y) {
    if (board[x][y].ship) {
      board[x][y].ship.hit();
      return true;
    }
    board[x][y].isAttacked = true;
    return false;
  }

  function isAllShipsSunk() {
    return board.every((row) => {
      return row.every((col) => {
        if (col.ship) {
          return col.ship.isSunk();
        }
        return true;
      });
    });
  }

  return {
    board,
    placeShipAt,
    receiveAttack,
    isAllShipsSunk,
  };
}
