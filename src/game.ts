import Grid from "./grid";

declare global {
  var _grid: Grid;
}

export default class Game {
  private grid: Grid;
  private players: string[] = [];
  private currentPlayer = 0;

  constructor(gridCols: number, gridRows: number, matchInLine: number) {
    this.grid = new Grid(gridCols, gridRows, matchInLine);
    window._grid = this.grid;
  }

  reset() {
    this.grid.reset();
    this.currentPlayer = 0;
  }

  addPlayer(playerID: string) {
    this.players.push(playerID);
  }

  getWinnerInfo() {
    return {
      winner: this.players[this.currentPlayer],
      cells: this.grid.winningCells,
    };
  }

  get gridState() {
    return this.grid;
  }

  commitPlay(column: number) {
    const rowIndex = this.grid.dropDisc(column, this.currentPlayer + 1);
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    return rowIndex;
  }

  checkForWin() {
    const win =
      this.grid.checkPlayerWinHorizontal(
        this.players.length - this.currentPlayer
      ) ||
      this.grid.checkPlayerWinVertical(
        this.players.length - this.currentPlayer
      ) ||
      this.grid.checkPlayerWinLeftDiag(
        this.players.length - this.currentPlayer
      ) ||
      this.grid.checkPlayerWinRightDiag(
        this.players.length - this.currentPlayer
      );

    if (win) {
      const event = new CustomEvent("game/win", {
        detail: this.getWinnerInfo(),
      });
      dispatchEvent(event);
    }

    return win;
  }
}
