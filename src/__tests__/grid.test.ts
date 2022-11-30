import Grid from "../grid";

describe(".getLayout()", () => {
  const gridSizes = [
    [3, 3],
    [16, 8],
    [10, 12],
    [2, 2],
    [1, 1],
    [1, 11],
    [100, 30],
    [30, 100],
    [11, 300],
    [41, 23],
    [31, 99],
  ];

  it.each(gridSizes)(
    "returns a 2 dimensional array of strings representing a grid sized %ix%i",
    (cols, rows) => {
      const grid = new Grid(cols, rows);
      const layout = grid.getLayout();

      expect(layout.length).toBe(rows);

      for (let row of layout) {
        expect(Array.isArray(row)).toBeTruthy();
        expect(row).toHaveLength(cols);
        expect(row.every((cell) => typeof cell == "string")).toBeTruthy();
      }
    }
  );
});

describe(".checkPlayerWinHorizontal()", () => {
  const grid = new Grid(3, 3);
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

  afterEach(() => {
    return grid.reset();
  });

  it.each(indices)(
    "checks whether player occupies n consecutive cells in row on a 3x3 grid: " +
      "%j, %j, %j",
    (...pos) => {
      const expected = pos.pop();
      const currentIndex = pos as number[][];

      for (const index of currentIndex) {
        grid.setIndexXY(index[0], index[1], "X");
      }

      for (let i = 0; i < expected.length; i++) {
        expect(grid.checkPlayerWinHorizontal("X", inLine[i])).toBe(expected[i]);
      }
    }
  );
});

describe(".checkPlayerWinVertical()", () => {
  const grid = new Grid(7, 5);
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

  afterEach(() => {
    return grid.reset();
  });

  it.each(indices)(
    "checks whether player occupies n consecutive cells in column on a 7x5 grid: " +
      "%j, %j, %j",
    (...pos) => {
      const expected = pos.pop();
      const currentIndex = pos as number[][];

      for (const index of currentIndex) {
        grid.setIndexXY(index[0], index[1], "X");
      }

      for (let i = 0; i < expected.length; i++) {
        expect(grid.checkPlayerWinVertical("X", inLine[i])).toBe(expected[i]);
      }
    }
  );
});

describe(".checkPlayerWinLeftDiag()", () => {
  const grid = new Grid(7, 5);
  const indices = [
    [[0, 4], [1, 3], [2, 2], [3, 1], 4, false],
    [[0, 4], [1, 2], [2, 2], [3, 1], 4, false],
    [[0, 4], [2, 3], [2, 3], [3, 0], 4, false],
    [[6, 4], [5, 3], [4, 2], [3, 1], 4, true],
    [[6, 4], [5, 3], [4, 2], [3, 1], 3, true],
    [[6, 4], [5, 3], [4, 2], [3, 1], 5, false],
    [[4, 2], [3, 1], [2, 0], [0, 0], 3, true],
  ];

  afterEach(() => {
    return grid.reset();
  });

  it.each(indices)(
    "checks whether player occupies n consecutive cells in left diagonal on a 7x5 grid: " +
      "%j, %j, %j, %j",
    (...pos) => {
      const expected = pos.pop() as boolean;
      const inLine = pos.pop() as number;
      const currentIndex = pos as number[][];

      for (const index of currentIndex) {
        grid.setIndexXY(index[0], index[1], "X");
      }

      expect(grid.checkPlayerWinLeftDiag("X", inLine)).toBe(expected);
    }
  );
});

describe(".checkPlayerWinRightDiag()", () => {
  const grid = new Grid(7, 5);
  const indices = [
    [[0, 4], [1, 3], [2, 2], [3, 1], true],
    [[0, 4], [1, 2], [2, 2], [3, 1], false],
    [[0, 4], [2, 3], [2, 3], [3, 0], false],
  ];

  afterEach(() => {
    return grid.reset();
  });

  it.each(indices)(
    "checks whether player occupies n consecutive cells in right diagonal on a 7x5 grid: " +
      "%j, %j, %j, %j",
    (...pos) => {
      const expected = pos.pop() as boolean;
      const currentIndex = pos as number[][];

      for (const index of currentIndex) {
        grid.setIndexXY(index[0], index[1], "X");
      }

      expect(grid.checkPlayerWinRightDiag("X", 4)).toBe(expected);
    }
  );
});
