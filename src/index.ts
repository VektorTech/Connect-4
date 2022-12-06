import "./style.css";

import Connect4 from "./connect4";
import GameView from "./ui/gameView";
import dummyAI from "./dummyAI";
import alphaBeta from "./alphaBeta";

window.addEventListener("load", () => {
  const message = document.getElementById("message");
  const gameView = new GameView(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT);
  const connect4 = new Connect4();
  gameView.generate(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT);

  gameView.addColumnClickHandler((columnNumber) => {
    gameView.lock = true;
    const row = connect4.commitPlay(columnNumber);
    gameView.addDisc(columnNumber, row);
    const win = connect4.checkForWin();

    if (!win) {
      setTimeout(async () => {
        const columns = connect4.gridState.availableColumns;

        if (columns.length) {
          message.innerText = "AI Thinking...";
          const col = (await alphaBeta(connect4.gridState)) as number;
          message.innerText = "";
          const row = connect4.commitPlay(col);
          if (!connect4.checkForWin()) {
            gameView.lock = false;
          }
          gameView.addDisc(col, row);
        }
      }, 400);
    }
  });
});
