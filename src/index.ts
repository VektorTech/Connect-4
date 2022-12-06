import "./style.css";

import Connect4 from "./connect4";
import GameView from "./ui/gameView";
import dummyAI from "./dummyAI";
import alphaBeta from "./alphaBeta";
import Grid from "./grid";

let timeout: NodeJS.Timeout;
let abortController: AbortController;
let currentAI = 4;

const AIList = [
  (grid: Grid, signal: AbortSignal) => dummyAI(grid, 0),
  (grid: Grid, signal: AbortSignal) => dummyAI(grid, 0.7),
  (grid: Grid, signal: AbortSignal) => alphaBeta(grid, signal, 2),
  (grid: Grid, signal: AbortSignal) => alphaBeta(grid, signal, 3),
  (grid: Grid, signal: AbortSignal) => alphaBeta(grid, signal, 5),
  (grid: Grid, signal: AbortSignal) => alphaBeta(grid, signal, 6),
  (grid: Grid, signal: AbortSignal) => alphaBeta(grid, signal, 8),
];

window.addEventListener("load", () => {
  const resetButton = document.getElementById("reset");
  const selectDifficulty = document.getElementById("difficulty");
  const message = document.getElementById("message");
  const gameView = new GameView(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT);
  const connect4 = new Connect4();
  gameView.generate(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT);

  gameView.addColumnClickHandler((columnNumber) => {
    abortController = new AbortController();
    gameView.lock = true;
    const row = connect4.commitPlay(columnNumber);
    gameView.addDisc(columnNumber, row);
    const win = connect4.checkForWin();

    if (!win) {
      timeout = setTimeout(async () => {
        try {
          const columns = connect4.gridState.availableColumns;

          if (columns.length) {
            message.innerText = "AI is thinking, please wait...";
            const col = await AIList[currentAI](
              connect4.gridState,
              abortController.signal
            );
            message.innerText = "";
            const row = connect4.commitPlay(col);
            if (!connect4.checkForWin()) {
              gameView.lock = false;
            }
            gameView.addDisc(col, row);
          }
        } catch (e) {
          console.log(e);
        } finally {
          abortController = null;
        }
      }, 400);
    }
  });

  resetButton.addEventListener("click", () => {
    message.innerHTML = "";
    connect4.reset();
    gameView.clear();
    clearTimeout(timeout);
    if (abortController) {
      abortController.abort();
    }
  });

  selectDifficulty.addEventListener("change", (e: InputEvent) => {
    currentAI = +(e.target as HTMLSelectElement).value;
  });
});
