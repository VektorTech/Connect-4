export default class GameView {
  private root: HTMLElement;
  private grid: HTMLElement;
  private discs: HTMLElement[];
  private cells: HTMLElement[];
  private colCount: number = 0;
  private rowCount: number = 0;
  private num: number = 0;
  private columnClickHandlers: Function[] = [];
  private discAdded = 0;

  public lock = false;

  constructor(col: number, row: number) {
    this.colCount = col;
    this.rowCount = row;
    this.discs = new Array(col * row);
    const _root = document.getElementById("game");
    if (_root instanceof HTMLElement) {
      this.root = _root;
    } else {
      throw new TypeError("Invalid Element Type");
    }
  }

  clear() {
    this.lock = false;
    this.cells.forEach(cell => cell.innerHTML = "");
    this.discAdded = 0;
    this.num = 0;
    this.discs = new Array(this.colCount * this.rowCount);
  }

  generate(col: number, row: number) {
    this.cells = [...new Array(col * row)].map((_) => {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      return cell;
    });
    this.grid = document.createElement("div");
    this.grid.className = "grid";
    this.grid.style.setProperty("--col", col.toString());
    this.grid.style.setProperty("--row", row.toString());
    this.grid.append(...this.cells);
    this.root.appendChild(this.grid);

    this.root.addEventListener("click", (e) => {
      if (!this.lock) {
        const columnNumber = ~~(
          ((e.clientX - this.root.offsetLeft) / this.root.offsetWidth) *
          col
        );
        this.columnClickHandlers.forEach((handler) => handler(columnNumber));
      }
    });

    addEventListener("game/win", (e: CustomEvent) => {
      this.lock = true;
      const { cells }: { cells: number[] } = e.detail;
      setTimeout(() => {
        cells.forEach((cell) => {
          this.discs[cell]?.classList.add("disc-win");
        });
      }, 150);
    });
  }

  addColumnClickHandler(handler: (column: number) => void) {
    this.columnClickHandlers.push(handler);
  }

  addDisc(col: number, row: number) {
    const disc = document.createElement("div");
    disc.className = "disc" + (this.num ? " gold" : "");
    disc.style.setProperty("--colOffset", col.toString());
    disc.style.setProperty("--rowOffset", row.toString());
    this.num = 1 - this.num;
    this.grid.appendChild(disc);
    const index = Grid.getIndexAtPosition(col, row, this.colCount);
    this.discs[index] = disc;
    disc.addEventListener("animationend", () => {
      this.cells[index].appendChild(disc);
    });
    this.discAdded += 1;

    if (this.discAdded == this.colCount * this.rowCount) {
      this.lock = true;
    }
  }
}
