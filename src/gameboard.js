export function gameboard(size, shipFactory) {
  let board = [];
  for (let y = 0; y < size; y++) {
    board.push([]);
    for (let x = 0; x < size; x++) {
      board[y].push({ ship: null, isAttacked: false });
    }
  }

  function placeShipAt(...coordinates) {
    const s = shipFactory(coordinates.length);
    coordinates.forEach(([x, y]) => {
      board[y][x].ship = s;
    });
  }

  function receiveAttack(x, y) {
    board[y][x].isAttacked = true;
    if (board[y][x].ship) {
      board[y][x].ship.hit();
      return true;
    }
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

  function getSquareAt(x, y) {
    return board[y][x];
  }

  function getShipSquares(ship) {
    let shipSquares = [];
    board.forEach((row, yIndex) => {
      row.forEach((square, xIndex) => {
        if (square.ship === ship) {
          shipSquares.push([xIndex, yIndex]);
        }
      });
    });

    return shipSquares;
  }

  return {
    board,
    placeShipAt,
    receiveAttack,
    isAllShipsSunk,
    getSquareAt,
    getShipSquares,
  };
}
