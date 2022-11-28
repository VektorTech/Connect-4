import "./style.css";

import Game from "./game";

import Grid from "./grid";

window.addEventListener("load", () => {
  const grid = new Grid(3, 3);
  console.table(grid.getLayout());
});
