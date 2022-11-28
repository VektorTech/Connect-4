export default class Grid {
  lastPlayer = "";
  width: number;
  height: number;
  cellCount: number;
  state: string[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cellCount = this.width * this.height;
    this.reset();
  }

  _getIndexAtPosition(x: number, y: number) {
    return x + y * this.width;
  }

  _getFillCount() {
    return this.state.reduce((total, current) => total + Number(!!current), 0);
  }

  _isGridFilled() {
    return this._getFillCount() == this.cellCount;
  }

  reset() {
    this.state = this.state = new Array(this.cellCount).fill("");
  }

  setIndex(position: number, player: string) {
    this.state[position] = player;
  }

  setIndexXY(positionX: number, positionY: number, player: string) {
    this.state[this._getIndexAtPosition(positionX, positionY)] = player;
  }

  verifyPlayerNinRow(player: string, n = 4) {
    for (let r = 0; r < this.height; r++) {
      let count = 0;
      for (let c = 0; c < this.width; c++) {
        count +=
          Number(this.state[this._getIndexAtPosition(c, r)] == player) ||
          -count;

        if (count == n) {
          return true;
        }
      }
    }
    return false;
  }

  verifyPlayerNinDiag(player: number, n = 4) {}

  getLayout() {
    return this.state.reduce<string[][]>((grid, cell, index) => {
      const rowIndex = ~~(index / this.width);

      if (!grid[rowIndex]) {
        grid[rowIndex] = [];
      }

      grid[rowIndex].push(cell);

      return grid;
    }, []);
  }
}
