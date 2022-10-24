import DOM from "./dom";
import { gameboard } from "./gameboard";
import {
  getRandomAdjacentXCoordinates,
  getRandomAdjacentYCoordinates,
} from "./gameUtils";
import { computerPlayer, player } from "./player";
import { ship } from "./ship";

gameLoop();

// TODO: Implement drag and drop

async function gameLoop() {
  let playersInfo = await DOM.getPlayersInfo();
  const player1 = player(playersInfo.p1.name);
  const player2 = computerPlayer();

  player1.setGameboard(gameboard(9, ship));
  player2.setGameboard(gameboard(9, ship));

  let isFirstPlayerTurn = true;

  DOM.displayBoards(player1, player2);
  const eventsHandler = DOM.setupHandlers(onAttack, randomPlacementBtnHandler);

  eventsHandler.enableRandomPlacementBtn();
  eventsHandler.enableAttackListener();

  randomizeShips(player2.gameboard, 2, true);

  function randomPlacementBtnHandler() {
    randomizeShips(player1.gameboard, 1);
  }

  function onAttack(ownerNum, x, y) {
    let receiver;
    x = Number(x);
    y = Number(y);
    if (ownerNum === 1) {
      receiver = player1;
    } else if (ownerNum === 2) {
      receiver = player2;
    } else {
      return;
    }
    if (receiver.gameboard.getSquareAt(x, y).isAttacked) return;

    if (isFirstPlayerTurn && receiver === player1) return;
    if (!isFirstPlayerTurn && receiver === player2) return;

    const isShipHit = receiver.gameboard.receiveAttack(x, y);
    // if ship was attacked check if ship is sunk and
    // update all ship squares with appropriate classes
    if (isShipHit) {
      let ship = receiver.gameboard.getSquareAt(x, y).ship;
      if (ship.isSunk()) {
        let shipSquares = receiver.gameboard.getShipSquares(ship);
        shipSquares.forEach(([x, y]) => {
          DOM.updateSquareState(
            ownerNum,
            x,
            y,
            receiver.gameboard.getSquareAt(x, y)
          );
        });
        if (receiver === player1) {
          // If ship is sunk clear adjacent moves
          player2.nextMoves = [];
        }
      } else if (receiver === player1) {
        player2.chooseAdjacentCoordinates({ x, y }, canAttackAt);
      }
    }
    DOM.updateSquareState(ownerNum, x, y, receiver.gameboard.getSquareAt(x, y));
    isFirstPlayerTurn = !isFirstPlayerTurn;

    if (receiver.gameboard.isAllShipsSunk()) {
      eventsHandler.disableAttackListener();
      DOM.displayMessage(
        `****${(receiver === player1 ? player2 : player1).name} Won!****`
      );
    } else if (receiver === player2) {
      let coords = player2.chooseCoordinates(canAttackAt);
      onAttack(1, coords.x, coords.y);
    }
  }

  function canAttackAt(x, y) {
    let square = player1.gameboard.getSquareAt(x, y);
    if (square && !square.isAttacked) {
      return true;
    }
    return false;
  }
}

function randomizeShips(gameboard, ownerNum, hide) {
  gameboard.resetBoard();
  let ship1 = getValidShipPlacement(
    gameboard,
    getRandomAdjacentXCoordinates.bind(null, 3, 9)
  );
  updateGameboard(gameboard, ship1);

  let ship2 = getValidShipPlacement(
    gameboard,
    getRandomAdjacentYCoordinates.bind(null, 3, 9)
  );
  updateGameboard(gameboard, ship2);

  let ship3 = getValidShipPlacement(
    gameboard,
    getRandomAdjacentYCoordinates.bind(null, 3, 9)
  );
  updateGameboard(gameboard, ship3);

  if (!hide) {
    DOM.clearBoard(ownerNum);
    updateDOM(gameboard, ownerNum, ship1, ship2, ship3);
  }
}

function getValidShipPlacement(gameboard, getRandomCoordinatesFunc) {
  let ship = getRandomCoordinatesFunc();
  while (!isValidShipPlacement(gameboard, ship)) {
    ship = getRandomCoordinatesFunc();
  }
  return ship;
}

function isValidShipPlacement(gameboard, sh = []) {
  return (
    sh.every((coords) => {
      let square = gameboard.getSquareAt(coords.x, coords.y);
      return square && !square.ship;
    }) && sh.length > 0
  );
}

function updateGameboard(gameboard, ...ships) {
  ships.forEach((ship) => {
    gameboard.placeShipAt(...ship.map(({ x, y }) => [x, y]));
  });
}

function updateDOM(gameboard, ownerNum, ...ships) {
  ships.forEach((ship) => {
    ship.forEach((coords) => {
      DOM.updateSquareState(
        ownerNum,
        coords.x,
        coords.y,
        gameboard.getSquareAt(coords.x, coords.y)
      );
    });
  });
}

// function prettyPrint(gameboard) {
//   let str = "";
//   for (let y = 0; y < gameboard.board.length; y++) {
//     for (let x = 0; x < gameboard.board[y].length; x++) {
//       if (gameboard.board[y][x].ship && gameboard.board[y][x].isAttacked) {
//         str += "1x\t";
//       } else if (gameboard.board[y][x].ship) {
//         str += "1\t";
//       } else if (gameboard.board[y][x].isAttacked) {
//         str += "x\t";
//       } else {
//         str += ".\t";
//       }
//     }
//     str += "\n";
//   }

//   console.log(str);
// }
