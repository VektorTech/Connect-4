export default class Grid {
  private columnCount: number;
  private rowCount: number;
  private NConsecutive: number;
  private cellCount: number;

  private lastPlayer = 0;
  private state: number[];
  private racks: number[];
  private winnerCells: number[] = [];

  constructor(width: number, height: number, NConsecutive: number) {
    this.columnCount = width;
    this.rowCount = height;
    this.NConsecutive = NConsecutive;
    this.cellCount = this.columnCount * this.rowCount;
    this.reset();
  }

  static getIndexAtPosition(x: number, y: number, col: number) {
    return x + y * col;
  }

  private getIndexAtPosition(x: number, y: number) {
    return Grid.getIndexAtPosition(x, y, this.columnCount);
  }

  private getPositionAtIndex(index: number) {
    const y = ~~(index / this.columnCount);
    const x = index - y * this.columnCount;

    return { x, y };
  }

  private getFillCount() {
    return this.state.reduce((total, current) => total + Number(!!current), 0);
  }

  reset() {
    this.state = new Array(this.cellCount).fill(0);
    this.racks = new Array(this.columnCount).fill(this.rowCount);
    this.winnerCells = [];
    this.lastPlayer = 0;
  }

  isGridFilled() {
    return this.getFillCount() == this.cellCount;
  }

  setIndex(position: number, player: number) {
    if (this.isGridFilled()) {
      throw new Error("No more slots available in grid");
    }
    this.lastPlayer = player;
    this.state[position] = player;
  }

  setIndexXY(positionX: number, positionY: number, player: number) {
    if (this.isGridFilled()) {
      throw new Error("No more slots available in grid");
    }
    this.lastPlayer = player;
    this.state[this.getIndexAtPosition(positionX, positionY)] = player;
  }

  dropDisc(colIndex: number, player: number) {
    if (this.isGridFilled()) {
      throw new Error("No more slots available in grid");
    }
    const rowIndex = --this.racks[colIndex];
    this.setIndexXY(colIndex, rowIndex, player);
    return rowIndex;
  }

  get winningCells() {
    return this.winnerCells;
  }

  get lastPlayerDisc() {
    return this.lastPlayer;
  }

  getNIndicesHorizontal(player: number) {
    if (
      this.NConsecutive > this.columnCount ||
      this.getFillCount() < this.NConsecutive
    ) {
      return [];
    }

    for (let row = this.rowCount - 1; row > -1; row--) {
      let indices = [];
      for (let col = 0; col < this.columnCount; col++) {
        const index = this.getIndexAtPosition(col, row);
        if (this.state[index] == player) {
          indices.push(index);
        } else if (indices.length) {
          indices = [];
        }

        if (indices.length == this.NConsecutive) {
          return indices;
        }
      }
    }
    return [];
  }

  checkPlayerWinHorizontal(player: number) {
    const results = this.getNIndicesHorizontal(player);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getNIndicesVertical(player: number) {
    if (
      this.NConsecutive > this.rowCount ||
      this.getFillCount() < this.NConsecutive
    ) {
      return [];
    }

    for (let col = 0; col < this.columnCount; col++) {
      let indices = [];
      for (let row = this.rowCount - 1; row > -1; row--) {
        const index = this.getIndexAtPosition(col, row);
        if (this.state[index] == player) {
          indices.push(index);
        } else if (indices.length) {
          indices = [];
        }

        if (indices.length == this.NConsecutive) {
          return indices;
        }
      }
    }
    return [];
  }

  checkPlayerWinVertical(player: number) {
    const results = this.getNIndicesVertical(player);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getNIndicesRightDiag(player: number) {
    if (
      this.NConsecutive > this.columnCount ||
      this.NConsecutive > this.rowCount ||
      this.getFillCount() < this.NConsecutive
    ) {
      return [];
    }

    const skip = this.columnCount - 1;

    let index = this.cellCount - this.NConsecutive;
    while (index >= this.columnCount * (this.NConsecutive - 1)) {
      if (this.state[index] == player) {
        let indices = [index];
        step: for (
          let diagIndex = index - skip;
          diagIndex >= this.NConsecutive - 1;
          diagIndex -= skip
        ) {
          if (this.state[diagIndex] == player) {
            indices.push(diagIndex);
          } else break step;

          if (indices.length == this.NConsecutive) {
            return indices;
          }
        }
      }

      index--;
      if ((index + 1) % this.columnCount == 0) {
        index -= this.NConsecutive - 1;
      }
    }

    return [];
  }

  checkPlayerWinRightDiag(player: number) {
    const results = this.getNIndicesRightDiag(player);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getNIndicesLeftDiag(player: number) {
    if (
      this.NConsecutive > this.columnCount ||
      this.NConsecutive > this.rowCount ||
      this.getFillCount() < this.NConsecutive
    ) {
      return [];
    }

    const skip = this.columnCount + 1;

    let index = this.cellCount - 1;
    while (
      index >=
      this.columnCount * (this.NConsecutive - 1) + (this.NConsecutive - 1)
    ) {
      if (this.state[index] == player) {
        let indices = [index];
        step: for (
          let diagIndex = index - skip;
          diagIndex > -1;
          diagIndex -= skip
        ) {
          if (this.state[diagIndex] == player) {
            indices.push(diagIndex);
          } else break step;

          if (indices.length == this.NConsecutive) {
            return indices;
          }
        }
      }

      if ((index - (this.NConsecutive - 1)) % this.columnCount == 0) {
        index -= this.NConsecutive;
      } else {
        index--;
      }
    }

    return [];
  }

  checkPlayerWinLeftDiag(player: number) {
    const results = this.getNIndicesLeftDiag(player);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  checkWinner(player: number) {
    return (
      this.checkPlayerWinHorizontal(player) ||
      this.checkPlayerWinVertical(player) ||
      this.checkPlayerWinLeftDiag(player) ||
      this.checkPlayerWinRightDiag(player)
    );
  }

  getLayout() {
    return this.state.reduce<number[][]>((grid, cell, index) => {
      const rowIndex = ~~(index / this.columnCount);

      if (!grid[rowIndex]) {
        grid[rowIndex] = [];
      }

      grid[rowIndex].push(cell);

      return grid;
    }, []);
  }

  get scorePosition() {
    const around = [
      [0, 1],
      [0, -1],
      [1, 0],
      [1, 1],
      [1, -1],
      [-1, 0],
      [-1, 1],
      [-1, -1],
    ];
    const midCol = (this.columnCount - 1) / 2;
    const score: Record<string | number, number> = {};
    for (let row = 0; row < this.rowCount; row++) {
      for (let col = 0; col < this.columnCount; col++) {
        const index = this.getIndexAtPosition(col, row);
        const player = this.state[index];

        if (player) {
          let i = 1;
          while (this.state[this.getIndexAtPosition(col + i, row)] == player) {
            score[player] = (score[player] ?? 0) + i;
            i++;
          }
          i = 1;
          while (this.state[this.getIndexAtPosition(col, row + i)] == player) {
            score[player] = (score[player] ?? 0) + i;
            i++;
          }
          i = 1;
          while (
            this.state[this.getIndexAtPosition(col + i, row + i)] == player
          ) {
            score[player] = (score[player] ?? 0) + i;
            i++;
          }
          i = 1;
          while (
            this.state[this.getIndexAtPosition(col - i, row + i)] == player
          ) {
            score[player] = (score[player] ?? 0) + i;
            i++;
          }
          const evaluation =
            around.reduce((acc, [c, r]) => {
              const _col = col + c;
              const _row = row + r;
              if (
                _col < 0 ||
                _col > this.columnCount - 1 ||
                _row < 0 ||
                _row > this.rowCount - 1
              ) {
                return acc;
              }
              const _i = this.getIndexAtPosition(_col, _row);
              return acc + Number(this.state[_i] == player);
            }, 1) * 0.5;
          const middleColumnsBias = midCol - Math.abs(midCol - col);
          score[player] = (score[player] ?? 0) + evaluation + middleColumnsBias;
        }
      }
    }
    return score;
  }

  get availableColumns() {
    return [...new Array(this.columnCount)]
      .map((_, i) => i)
      .filter((i) => this.racks[i] - 1 > -1);
  }

  clone() {
    const cloned: Grid & { __proto__: Grid } = Object.assign({
      state: [...this.state],
      racks: [...this.racks],
      lastPlayer: this.lastPlayer,
      columnCount: this.columnCount,
      rowCount: this.rowCount,
      cellCount: this.cellCount,
      NConsecutive: this.NConsecutive,
      winnerCells: [],
    });
    cloned.__proto__ = Grid.prototype;
    return cloned;
  }
}

export type GridType = typeof Grid;

declare global {
  var Grid: GridType;
}

if (typeof self == "object") {
  self.Grid = Grid;
}
