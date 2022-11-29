export default class Grid {
  private lastPlayer = "";
  private columnCount: number;
  private rowCount: number;
  private cellCount: number;
  private state: string[];

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
    const x = -(y * this.columnCount) + n;

    return { x, y };
  }

  private getFillCount() {
    return this.state.reduce((total, current) => total + Number(!!current), 0);
  }

  private isGridFilled() {
    return this.getFillCount() == this.cellCount;
  }

  private shouldStopCheckNinLine(n: number) {
    return this.getFillCount() < n;
  }

  reset() {
    this.state = this.state = new Array(this.cellCount).fill("");
  }

  setIndex(position: number, player: string) {
    this.lastPlayer = player;
    this.state[position] = player;
  }

  setIndexXY(positionX: number, positionY: number, player: string) {
    this.lastPlayer = player;
    this.state[this.getIndexAtPosition(positionX, positionY)] = player;
  }

  returnPlayerNinRowIndices(player: string, n = 4) {
    if (n > this.columnCount || this.shouldStopCheckNinLine(n)) {
      return [];
    }

    for (let r = this.rowCount - 1; r > -1; r--) {
      let indices = [];
      for (let c = 0; c < this.columnCount; c++) {
        const index = this.getIndexAtPosition(c, r);
        if (this.state[index] == player) {
          indices.push(index);
        } else if (indices.length) {
          indices = [];
        }

        if (indices.length == n) {
          return indices;
        }
      }
    }
    return [];
  }

  verifyPlayerNinRow(player: string, n = 4) {
    if (n > this.columnCount || this.shouldStopCheckNinLine(n)) {
      return false;
    }

    for (let r = this.rowCount - 1; r > -1; r--) {
      let count = 0;
      for (let c = 0; c < this.columnCount; c++) {
        count +=
          Number(this.state[this.getIndexAtPosition(c, r)] == player) || -count;

        if (count == n) {
          return true;
        }
      }
    }
    return false;
  }

  returnPlayerNinColIndices(player: string, n = 4) {
    if (n > this.rowCount || this.shouldStopCheckNinLine(n)) {
      return [];
    }

    for (let c = 0; c < this.columnCount; c++) {
      let indices = [];
      for (let r = this.rowCount - 1; r > -1; r--) {
        const index = this.getIndexAtPosition(c, r);
        if (this.state[index] == player) {
          indices.push(index);
        } else if (indices.length) {
          indices = [];
        }

        if (indices.length == n) {
          return indices;
        }
      }
    }
    return [];
  }

  verifyPlayerNinCol(player: string, n = 4) {
    if (n > this.rowCount || this.shouldStopCheckNinLine(n)) {
      return false;
    }

    for (let c = 0; c < this.columnCount; c++) {
      let count = 0;
      for (let r = this.rowCount - 1; r > -1; r--) {
        count +=
          Number(this.state[this.getIndexAtPosition(c, r)] == player) || -count;

        if (count == n) {
          return true;
        }
      }
    }
    return false;
  }

  verifyPlayerNinRightDiags(player: string, n = 4) {
    if (
      n > this.columnCount ||
      n > this.rowCount ||
      this.shouldStopCheckNinLine(n)
    ) {
      return false;
    }

    const jump = this.columnCount - 1;

    let i = this.cellCount - n + 1;
    while (i > this.columnCount * (n - 1)) {
      if (this.state[i] == player) {
        let _count = 1;
        checkDiag: for (let d = i - jump; d > n - 1; d - jump) {
          if (this.state[d] == player) {
            _count++;
          } else break checkDiag;

          if (_count == n) {
            return true;
          }
        }
      }

      if ((i + 1) % this.columnCount == 0) {
        i -= n + 1;
      } else {
        i--;
      }
    }

    return false;
  }

  verifyPlayerNinLeftDiags(player: string, n = 4) {
    if (
      n > this.columnCount ||
      n > this.rowCount ||
      this.shouldStopCheckNinLine(n)
    ) {
      return false;
    }

    const jump = this.columnCount + 1;

    let i = this.cellCount - 1;
    while (i > this.columnCount * (n - 1) + (n - 1)) {
      if (this.state[i] == player) {
        let _count = 1;
        checkDiag: for (let d = i - jump; d > -1; d - jump) {
          if (this.state[d] == player) {
            _count++;
          } else break checkDiag;

          if (_count == n) {
            return true;
          }
        }
      }

      if ((i - (n - 1)) % this.columnCount == 0) {
        i -= n;
      } else {
        i--;
      }
    }

    return false;
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
