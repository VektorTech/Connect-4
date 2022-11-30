export default class Grid {
  private lastPlayer = "";
  private columnCount: number;
  private rowCount: number;
  private cellCount: number;
  private state: string[];
  private racks: number[];
  private winnerCells: number[] = [];

  constructor(width: number, height: number) {
    this.columnCount = width;
    this.rowCount = height;
    this.cellCount = this.columnCount * this.rowCount;
    this.reset();
  }

  private getIndexAtPosition(x: number, y: number) {
    return x + y * this.columnCount;
  }

  private getPositionAtIndex(n: number) {
    const y = ~~(n / this.columnCount);
    const x = n - y * this.columnCount;

    return { x, y };
  }

  private getFillCount() {
    return this.state.reduce((total, current) => total + Number(!!current), 0);
  }

  private isBelowFillCount(n: number) {
    return this.getFillCount() < n;
  }

  reset() {
    this.state = new Array(this.cellCount).fill("");
    this.racks = new Array(this.columnCount).fill(this.rowCount);
  }

  isGridFilled() {
    return this.getFillCount() == this.cellCount;
  }

  setIndex(position: number, player: string) {
    this.lastPlayer = player;
    this.state[position] = player;
  }

  setIndexXY(positionX: number, positionY: number, player: string) {
    this.lastPlayer = player;
    this.state[this.getIndexAtPosition(positionX, positionY)] = player;
  }

  dropDisc(colIndex: number, player: string) {
    const rowIndex = --this.racks[colIndex];
    this.setIndexXY(colIndex, rowIndex, player);
    return rowIndex;
  }

  get winningCells() {
    return this.winnerCells;
  }

  getWinningIndicesHorizontal(player: string, inLine = 4) {
    if (inLine > this.columnCount || this.isBelowFillCount(inLine)) {
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

        if (indices.length == inLine) {
          return indices;
        }
      }
    }
    return [];
  }

  checkPlayerWinHorizontal(player: string, inLine = 4) {
    const results = this.getWinningIndicesHorizontal(player, inLine);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getWinningIndicesVertical(player: string, inLine = 4) {
    if (inLine > this.rowCount || this.isBelowFillCount(inLine)) {
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

        if (indices.length == inLine) {
          return indices;
        }
      }
    }
    return [];
  }

  checkPlayerWinVertical(player: string, inLine = 4) {
    const results = this.getWinningIndicesVertical(player, inLine);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getWinningIndicesRightDiag(player: string, inLine = 4) {
    if (
      inLine > this.columnCount ||
      inLine > this.rowCount ||
      this.isBelowFillCount(inLine)
    ) {
      return [];
    }

    const skip = this.columnCount - 1;

    let index = this.cellCount - inLine;
    while (index > this.columnCount * (inLine - 1)) {
      if (this.state[index] == player) {
        let indices = [index];
        step: for (
          let diagIndex = index - skip;
          diagIndex > inLine - 1;
          diagIndex -= skip
        ) {
          if (this.state[diagIndex] == player) {
            indices.push(diagIndex);
          } else break step;

          if (indices.length == inLine) {
            return indices;
          }
        }
      }

      if ((index + 1) % this.columnCount == 0) {
        index -= inLine + 1;
      } else {
        index--;
      }
    }

    return [];
  }

  checkPlayerWinRightDiag(player: string, inLine = 4) {
    const results = this.getWinningIndicesRightDiag(player, inLine);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getWinningIndicesLeftDiag(player: string, inLine = 4) {
    if (
      inLine > this.columnCount ||
      inLine > this.rowCount ||
      this.isBelowFillCount(inLine)
    ) {
      return [];
    }

    const skip = this.columnCount + 1;

    let index = this.cellCount - 1;
    while (index > this.columnCount * (inLine - 1) + (inLine - 1)) {
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

          if (indices.length == inLine) {
            return indices;
          }
        }
      }

      if ((index - (inLine - 1)) % this.columnCount == 0) {
        index -= inLine;
      } else {
        index--;
      }
    }

    return [];
  }

  checkPlayerWinLeftDiag(player: string, inLine = 4) {
    const results = this.getWinningIndicesLeftDiag(player, inLine);
    const passed = !!results.length;

    if (passed) {
      this.winnerCells = results;
    }

    return passed;
  }

  getLayout() {
    return this.state.reduce<string[][]>((grid, cell, index) => {
      const rowIndex = ~~(index / this.columnCount);

      if (!grid[rowIndex]) {
        grid[rowIndex] = [];
      }

      grid[rowIndex].push(cell);

      return grid;
    }, []);
  }
}
