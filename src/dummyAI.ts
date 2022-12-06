import Grid from "./grid";

export default async function dummyAI(grid: Grid, threshold: number) {
  const randPos = ~~(Math.random() * grid.availableColumns.length);
  let bestMove = grid.availableColumns[randPos];
  let bestScore = 0;

  if (Math.random() < threshold) {
    for (const col of grid.availableColumns) {
      const cloned = grid.clone();
      cloned.dropDisc(col, 2);
      const score = cloned.scorePosition[2];

      if (score > bestScore) {
        bestMove = col;
        bestScore = score;
      }
    }
  }

  return bestMove;
}
