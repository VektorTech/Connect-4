import "./styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Connect4 from "./games/connect4";
import GameView from "./ui/gameView";
import dummyAI from "./ai/dummyAI";
import alphaBeta from "./ai/alphaBeta";
import Grid from "./grid";
import SelectModeView from "./ui/selectModeView";

let timeout: NodeJS.Timeout;
let abortController: AbortController;

let defaultAILevel = 4;
const AILevelList = [
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
  const mainButton = document.getElementById("main");
  const selectDifficulty = document.getElementById("difficulty");
  const message = document.getElementById("message");

  const selectModeView = new SelectModeView();
  const gameView = new GameView(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT);

  const connect4 = new Connect4();
  selectModeView.showSelectScreen();

  const resetGame = () => {
    message.innerHTML = "";
    connect4.reset();
    gameView.clear();
    clearTimeout(timeout);
    if (abortController) {
      abortController.abort();
    }
  };

  addEventListener("game/pending", (e: CustomEvent) => {
    console.log(e);
  });

  addEventListener("game/start", (e: CustomEvent) => {
    setTimeout(() => {
      gameView.generate(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT);
    }, 0);

    if (e.detail.bot) {
      connect4.addPlayer("Human");
      connect4.addPlayer("AI");
    } else {
    }

    gameView.addColumnClickHandler((columnNumber) => {
      abortController = new AbortController();
      gameView.lock = true;
      const row = connect4.commitPlay(columnNumber);
      gameView.addDisc(columnNumber, row);
      const win = connect4.checkForWin();

      if (!win && e.detail.bot) {
        timeout = setTimeout(async () => {
          try {
            const columns = connect4.gridState.availableColumns;

            if (columns.length) {
              message.innerText = "AI is thinking, please wait...";
              const col = await AILevelList[defaultAILevel](
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
      } else {
        timeout = setTimeout(() => {
          if (!connect4.checkForWin()) {
            gameView.lock = false;
          }
        }, 400);
      }
    });
  });

  resetButton.addEventListener("click", () => {
    resetGame();
    dispatchEvent(
      new CustomEvent("game/start", { detail: { bot: true, name: "AI" } })
    );
  });
  mainButton.addEventListener("click", () => {
    resetGame();
    selectModeView.showSelectScreen();
  });

  selectDifficulty.addEventListener("change", (e: InputEvent) => {
    defaultAILevel = +(e.target as HTMLSelectElement).value;
  });
});
