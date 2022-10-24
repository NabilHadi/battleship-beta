import "./style.css";
import { createElement, modal } from "./domUtils";

const DOM = (function () {
  // Root Element
  const root = createElement({ tag: "div", attributes: { id: "root" } });
  document.body.append(root);
  root.append(modal.getView());

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

  // Display Player 2 board
  let player2GridBoard = createElement({
    tag: "div",
    classNames: ["board"],
    attributes: { id: "player-2-board" },
  });
  boardsContainer.append(player2GridBoard);

  let outputDiv = createElement({
    tag: "div",
    attributes: { id: "output-div" },
  });
  boardsContainer.append(outputDiv);

  const buttonsContainer = createElement({
    tag: "div",
    classNames: ["buttons-container"],
  });
  root.append(buttonsContainer);

  const randomShipsBtn = createElement({
    tag: "button",
    classNames: ["btn", "clickable"],
    textContent: "Random Placement",
  });
  buttonsContainer.append(randomShipsBtn);

  function addButtonsClickHandlers(randomPlacementBtnHandler) {
    if (randomPlacementBtnHandler) {
      randomShipsBtn.addEventListener("click", randomPlacementBtnHandler);
    }
  }

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
    let player1Board = player1.gameboard;
    let player2Board = player2.gameboard;

    renderBoard(player1GridBoard, player1Board, 1);
    renderBoard(player2GridBoard, player2Board, 2, true);

    function renderBoard(grid, gameboard, playerNum, hide) {
      for (let y = gameboard.board.length - 1; y >= 0; y--) {
        for (let x = 0; x < gameboard.board[y].length; x++) {
          let classes = [];
          if (!hide) {
            if (gameboard.getSquareAt(x, y).isAttacked)
              classes.push("attacked");
            if (gameboard.getSquareAt(x, y).ship) {
              classes.push("has-ship");
              if (gameboard.getSquareAt(x, y).ship.isSunk()) {
                classes.push("sunk-ship");
              }
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

  let eventHandlers = {};

  function setupClickHandlers(_onAttackFunc) {
    // should ignore clicks outside squares
    // should ignore clicks on attacked squared
    eventHandlers.onAttackFunc = _onAttackFunc;
    addAttackListener();
  }

  function addAttackListener() {
    boardsContainer.addEventListener("click", onClickAttackHandler);
  }

  function removeAttackListener() {
    boardsContainer.removeEventListener("click", onClickAttackHandler);
  }

  function onClickAttackHandler(e) {
    if (!e.target.classList.contains("board-square")) return;
    let sqaure = e.target;
    eventHandlers.onAttackFunc(
      Number(sqaure.dataset.owner),
      sqaure.dataset.x,
      sqaure.dataset.y
    );
  }

  function updateSquareState(ownerNum, x, y, boardSquareObj) {
    let playerGrid;
    if (ownerNum === 1) {
      playerGrid = player1GridBoard;
    } else if (ownerNum === 2) {
      playerGrid = player2GridBoard;
    } else {
      return;
    }

    let square = Array.from(playerGrid.childNodes).find((node) => {
      return node.dataset.x == x && node.dataset.y == y;
    });

    if (!square) return;

    if (boardSquareObj.isAttacked) {
      square.classList.add("attacked");
    }
    if (boardSquareObj.ship) {
      square.classList.add("has-ship");
      if (boardSquareObj.ship.isSunk()) {
        square.classList.add("sunk-ship");
      }
    }
  }

  function displayMessage(str) {
    outputDiv.textContent = str;
  }

  return {
    modal,
    getPlayersInfo,
    displayBoards,
    setupClickHandlers,
    updateSquareState,
    removeAttackListener,
    displayMessage,
    addButtonsClickHandlers,
  };
})();

export default DOM;
