import Grid from "../grid";

const HUMAN = 1;
const AI = 2;

const AIWorker = new Worker("./alphaBetaWorker.bundle.js");

export default function alphaBeta(grid: Grid, signal: AbortSignal, depth: number) {
  const error = new DOMException("Aborted Calculation in Worker", "AbortError");
  return new Promise<number>((resolve, reject) => {
    if (signal.aborted) {
      return reject(error);
    }

    if (window.Worker) {
      AIWorker.postMessage([grid, depth]);
      AIWorker.onmessage = (e) => {
        resolve(e.data as number);
      };
      signal.addEventListener("abort", () => {
        reject(error);
      });
    }
  });
}
