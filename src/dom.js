import "./style.css";
import { createElement, modal } from "./domUtils";

const DOM = (function () {
  const root = createElement({ tag: "div", attributes: { id: "root" } });
  document.body.append(root);

  root.append(modal.getView());

  async function getPlayersInfo() {
    return new Promise((res) => {
      res({
        p1: {
          name: "Human",
        },
        p2: {
          name: "Computer",
        },
      });
    });
  }

  function displayBoards(player1, player2) {
    // Create Boards container
    let boardsContainer = createElement({
      tag: "div",
      classNames: ["boards-container"],
    });
    root.append(boardsContainer);

    // Display Player 1 board
    let player1GridBoard = createElement({
      tag: "div",
      classNames: ["board"],
      attributes: { id: "player-1-board" },
    });
    boardsContainer.append(player1GridBoard);
    let player1Board = player1.gameboard;
    renderBoard(player1GridBoard, player1Board, 1);

    // Display Player 2 board
    let player2GridBoard = createElement({
      tag: "div",
      classNames: ["board"],
      attributes: { id: "player-2-board" },
    });
    boardsContainer.append(player2GridBoard);
    let player2Board = player2.gameboard;
    renderBoard(player2GridBoard, player2Board, 2);

    function renderBoard(grid, gameboard, playerNum) {
      for (let y = gameboard.board.length - 1; y >= 0; y--) {
        for (let x = 0; x < gameboard.board[y].length; x++) {
          let classes = [];
          if (gameboard.getSquareAt(x, y).isAttacked) classes.push("attacked");
          if (gameboard.getSquareAt(x, y).ship) {
            classes.push("has-ship");
            if (gameboard.getSquareAt(x, y).ship.isSunk()) {
              classes.push("sunk-ship");
            }
          }

          let square = createElement({
            tag: "div",
            classNames: ["board-square", ...classes],
            dataset: { x, y, owner: playerNum },
          });
          grid.append(square);
        }
      }
    }
  }

  return {
    modal,
    getPlayersInfo,
    displayBoards,
  };
})();

export default DOM;
