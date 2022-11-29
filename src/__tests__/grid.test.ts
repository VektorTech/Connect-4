import Grid from "../grid";

describe(".getLayout()", () => {
  it("returns a 2 dimensional array of strings representing the grid", () => {
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

    for (let size of gridSizes) {
      const grid = new Grid(size[0], size[1]);
      const layout = grid.getLayout();

      expect(layout.length).toBe(size[1]);

      for (let row of layout) {
        expect(Array.isArray(row)).toBe(true);
        expect(row.length).toBe(size[0]);
        expect(row.every((cell) => typeof cell == "string")).toBe(true);
      }
    }
  });
});

describe(".verifyPlayerNinRow()", () => {
  it("checks whether player occupies n consecutive cells in row on a 3x3 grid", () => {
    const grid = new Grid(3, 3);

    const testCases = 4;
    const indices = [
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [2, 1],
        [0, 2],
        [1, 2],
      ],
      [
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
      ],
    ];
    const expectedResults = [
      [true, false, true],
      [true, false, true],
      [false, false, true],
      [false, false, true],
    ];
    const inLine = [3, 4, 2];

    for (let i = 0; i < testCases; i++) {
      const currentIndex = indices[i];
      for (let index of currentIndex) {
        grid.setIndexXY(index[0], index[1], "X");
      }

      const currentExpected = expectedResults[i];
      for (let j = 0; j < currentExpected.length; j++) {
        expect(grid.verifyPlayerNinRow("X", inLine[j])).toBe(
          currentExpected[j]
        );
      }

      grid.reset();
    }
  });
});

describe(".verifyPlayerNinCol()", () => {
  it("checks whether player occupies n consecutive cells in column on a 7x5 grid", () => {
    const grid = new Grid(7, 5);

    const testCases = 4;
    const indices = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [3, 3],
        [3, 2],
        [3, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 0],
      ],
      [
        [2, 4],
        [2, 3],
        [3, 4],
        [3, 3],
      ],
    ];
    const expectedResults = [
      [true, false, true],
      [true, false, true],
      [false, false, true],
      [false, false, true],
    ];
    const inLine = [3, 4, 2];

    for (let i = 0; i < testCases; i++) {
      const currentIndex = indices[i];
      for (let index of currentIndex) {
        grid.setIndexXY(index[0], index[1], "X");
      }

      const currentExpected = expectedResults[i];
      for (let j = 0; j < currentExpected.length; j++) {
        expect(grid.verifyPlayerNinCol("X", inLine[j])).toBe(
          currentExpected[j]
        );
      }

      grid.reset();
    }
  });
});

describe(".verifyPlayerNinRightDiags()", () => {
  it("checks whether player occupies n consecutive cells in right diagonal on a 7x5 grid", () => {
    const grid = new Grid(7, 5);

    grid.setIndexXY(0, 4, "X");
    grid.setIndexXY(1, 3, "X");
    grid.setIndexXY(2, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinRightDiags("X", 4)).toBe(true);
    grid.reset();

    grid.setIndexXY(0, 4, "X");
    grid.setIndexXY(1, 2, "X");
    grid.setIndexXY(2, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinRightDiags("X", 4)).toBe(false);
    grid.reset();

    grid.setIndexXY(0, 4, "X");
    grid.setIndexXY(2, 3, "X");
    grid.setIndexXY(2, 3, "X");
    grid.setIndexXY(3, 0, "X");
    expect(grid.verifyPlayerNinRightDiags("X", 4)).toBe(false);
  });
});

describe(".verifyPlayerNinLeftDiags()", () => {
  it("checks whether player occupies n consecutive cells in left diagonal on a 7x5 grid", () => {
    const grid = new Grid(7, 5);

    grid.setIndexXY(0, 4, "X");
    grid.setIndexXY(1, 3, "X");
    grid.setIndexXY(2, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 4)).toBe(false);
    grid.reset();

    grid.setIndexXY(0, 4, "X");
    grid.setIndexXY(1, 2, "X");
    grid.setIndexXY(2, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 4)).toBe(false);
    grid.reset();

    grid.setIndexXY(0, 4, "X");
    grid.setIndexXY(2, 3, "X");
    grid.setIndexXY(2, 3, "X");
    grid.setIndexXY(3, 0, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 4)).toBe(false);
    grid.reset();

    grid.setIndexXY(6, 4, "X");
    grid.setIndexXY(5, 3, "X");
    grid.setIndexXY(4, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 4)).toBe(true);

    grid.setIndexXY(6, 4, "X");
    grid.setIndexXY(5, 3, "X");
    grid.setIndexXY(4, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 3)).toBe(true);

    grid.setIndexXY(6, 4, "X");
    grid.setIndexXY(5, 3, "X");
    grid.setIndexXY(4, 2, "X");
    grid.setIndexXY(3, 1, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 5)).toBe(false);

    grid.setIndexXY(4, 2, "X");
    grid.setIndexXY(3, 1, "X");
    grid.setIndexXY(2, 0, "X");
    expect(grid.verifyPlayerNinLeftDiags("X", 3)).toBe(true);
  });
});
