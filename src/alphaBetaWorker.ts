import type Grid from "./grid";

importScripts("grid.bundle.js");

const grid = new self.Grid(7, 6, 4);

addEventListener('message', e => {
  for (let key in e.data) {
    // @ts-ignore
    grid[key] = e.data[key];
  }
  const [bestMove] = alphaBetaAI(grid);
  postMessage(bestMove);
});

const HUMAN = 1;
const AI = 2;

function alphaBetaAI(
  grid: Grid,
  depth = 8,
  alpha = -Infinity,
  beta = Infinity,
  isMaximizingPlayer = true
) {
  const currentPlayer = isMaximizingPlayer ? AI : HUMAN;
  const lastPlayer = isMaximizingPlayer ? HUMAN : AI;

  let bestMove;
  let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

  if (depth == 0 || isWinner(grid, lastPlayer) || grid.isGridFilled()) {
    const score = evaluatePosition(grid) * (depth + 1);
    return [undefined, score];
  }

  for (const col of grid.availableColumns) {
    const cloned = grid.clone();
    cloned.dropDisc(col, currentPlayer);
    const [_, _score] = alphaBetaAI(
      cloned,
      depth - 1,
      alpha,
      beta,
      !isMaximizingPlayer
    );

    if (isMaximizingPlayer) {
      if (_score > bestScore) {
        bestScore = _score;
        bestMove = col;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (_score < bestScore) {
        bestScore = _score;
        bestMove = col;
      }
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) break;
  }

  return [bestMove, bestScore];
}

function isWinner(grid: Grid, player: number) {
  return (
    grid.checkPlayerWinHorizontal(player) ||
    grid.checkPlayerWinVertical(player) ||
    grid.checkPlayerWinLeftDiag(player) ||
    grid.checkPlayerWinRightDiag(player)
  );
}

function evaluatePosition(grid: Grid) {
  const score = grid.scorePosition;
  const AIScore = score[AI] + Number(isWinner(grid, AI)) * 10000;
  const HUMANScore = score[HUMAN] + Number(isWinner(grid, HUMAN)) * 10000;

  return AIScore - HUMANScore;
}
