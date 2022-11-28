import Grid from "./grid";

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
