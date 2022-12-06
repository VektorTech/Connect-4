import Grid from "../grid";

describe(".getLayout()", () => {
  const gridSizes = [
    [3, 3, 4],
    [16, 8, 4],
    [10, 12, 4],
    [2, 2, 4],
    [1, 1, 4],
    [1, 11, 4],
    [100, 30, 4],
    [30, 100, 4],
    [11, 300, 4],
    [41, 23, 4],
    [31, 99, 4],
  ];

  it.each(gridSizes)(
    "returns a 2 dimensional array of numbers representing a grid sized %ix%i",
    (cols, rows, n) => {
      const grid = new Grid(cols, rows, n);
      const layout = grid.getLayout();

      expect(layout.length).toBe(rows);

      for (let row of layout) {
        expect(Array.isArray(row)).toBeTruthy();
        expect(row).toHaveLength(cols);
        expect(row.every((cell) => typeof cell == "number")).toBeTruthy();
      }
    }
  );
});

describe(".checkPlayerWinHorizontal()", () => {
  const indices = [
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [true, false, true],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [true, false, true],
    ],
    [
      [2, 1],
      [0, 2],
      [1, 2],
      [false, false, true],
    ],
    [
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [false, false, true],
    ],
  ];
  const inLine = [3, 4, 2];

  it.each(indices)(
    "checks whether player occupies n consecutive cells in row on a 3x3 grid: " +
      "%j, %j, %j",
    (...pos) => {
      const expected = pos.pop();
      const current = pos as number[][];

      for (let i = 0; i < expected.length; i++) {
        const grid = new Grid(3, 3, inLine[i]);

        for (const index of current) {
          grid.setIndexXY(index[0], index[1], 1);
        }
        expect(grid.checkPlayerWinHorizontal(1)).toBe(expected[i]);
      }
    }
  );
});

describe(".checkPlayerWinVertical()", () => {
  const indices = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [true, false, true],
    ],
    [
      [3, 3],
      [3, 2],
      [3, 1],
      [true, false, true],
    ],
    [
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 0],
      [false, false, true],
    ],
    [
      [2, 4],
      [2, 3],
      [3, 4],
      [3, 3],
      [false, false, true],
    ],
  ];
  const inLine = [3, 4, 2];

  it.each(indices)(
    "checks whether player occupies n consecutive cells in column on a 7x5 grid: " +
      "%j, %j, %j",
    (...pos) => {
      const expected = pos.pop();
      const current = pos as number[][];

      for (let i = 0; i < expected.length; i++) {
        const grid = new Grid(7, 5, inLine[i]);

        for (const index of current) {
          grid.setIndexXY(index[0], index[1], 1);
        }
        expect(grid.checkPlayerWinVertical(1)).toBe(expected[i]);
      }
    }
  );
});

describe(".checkPlayerWinLeftDiag()", () => {
  const indices = [
    [[0, 4], [1, 3], [2, 2], [3, 1], 4, [], false],
    [[0, 4], [1, 2], [2, 2], [3, 1], 4, [], false],
    [[0, 4], [2, 3], [2, 3], [3, 0], 4, [], false],
    [[6, 4], [5, 3], [4, 2], [3, 1], 4, [34, 26, 18, 10], true],
    [[6, 4], [5, 3], [4, 2], [3, 1], 3, [34, 26, 18], true],
    [[6, 4], [5, 3], [4, 2], [3, 1], 5, [], false],
    [[4, 2], [3, 1], [2, 0], [0, 0], 3, [18, 10, 2], true],
  ];

  it.each(indices)(
    "checks whether player occupies n consecutive cells in left diagonal on a 7x5 grid: " +
      "%j, %j, %j, %j",
    (...pos) => {
      const expectedBool = pos.pop() as boolean;
      const expectedList = pos.pop() as number[];
      const inLine = pos.pop() as number;
      const current = pos as number[][];
      const grid = new Grid(7, 5, inLine);

      for (const index of current) {
        grid.setIndexXY(index[0], index[1], 1);
      }

      expect(grid.checkPlayerWinLeftDiag(1)).toBe(expectedBool);
      expect(grid.winningCells).toEqual(expectedList);
    }
  );
});

describe(".checkPlayerWinRightDiag()", () => {
  const indices = [
    [[0, 4], [1, 3], [2, 2], [3, 1], 4, [28, 22, 16, 10], true],
    [[0, 4], [1, 2], [2, 2], [3, 1], 4, [], false],
    [[0, 4], [2, 3], [2, 3], [3, 0], 4, [], false],
    [[0, 3], [1, 2], [2, 1], [6, 3], 4, [], false],
    [[0, 3], [1, 2], [2, 1], [3, 0], 4, [21, 15, 9, 3], true],
    [[0, 4], [1, 3], [2, 2], [3, 1], 4, [28, 22, 16, 10], true],
  ];

  it.each(indices)(
    "checks whether player occupies n consecutive cells in right diagonal on a 7x5 grid: " +
      "%j, %j, %j, %j",
    (...pos) => {
      const expectedBool = pos.pop() as boolean;
      const expectedList = pos.pop() as number[];
      const inLine = pos.pop() as number;
      const current = pos as number[][];
      const grid = new Grid(7, 5, inLine);


      for (const index of current) {
        grid.setIndexXY(index[0], index[1], 1);
      }

      expect(grid.checkPlayerWinRightDiag(1)).toBe(expectedBool);
      expect(grid.winningCells).toEqual(expectedList);
    }
  );
});
