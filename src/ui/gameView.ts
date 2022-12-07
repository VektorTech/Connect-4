import * as bootStrap from "bootstrap";

export default class GameView {
  private root: HTMLElement;
  private grid: HTMLElement;
  private discs: HTMLElement[];
  private cells: CellType[];
  private colCount: number = 0;
  private rowCount: number = 0;
  private num: number = 0;
  private columnClickHandlers: Function[] = [];
  private gameOverModal: bootStrap.Modal;
  private discAdded = 0;

  public lock = false;

  constructor(col: number, row: number) {
    this.gameOverModal = new bootStrap.Modal("#gameOverModal");
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
    this.cells?.forEach((cell) => (cell.cellInner.innerHTML = ""));
    this.discAdded = 0;
    this.num = 0;
    this.discs = new Array(this.colCount * this.rowCount);
    this.columnClickHandlers = [];
    this.root.removeEventListener("click", this.root.onclick);
  }

  generate(col: number, row: number) {
    this.cells = [...new Array(col * row)].map((_) => {
      const cell: CellType = document.createElement("div");
      const cellInner = document.createElement("div");
      cell.className = "grid-cell";
      cellInner.className = "grid-cell-inner";
      cell.appendChild(cellInner);
      cell.cellInner = cellInner;
      return cell;
    });
    this.grid = document.createElement("div");
    this.grid.className = "grid";
    this.grid.style.setProperty("--col", col.toString());
    this.grid.style.setProperty("--row", row.toString());
    this.grid.append(...this.cells);
    const decoration = document.createElement("div");
    decoration.className = "grid-dec";
    this.root.replaceChildren(this.grid);
    this.root.appendChild(decoration);

    this.root.addEventListener("click", (e) => {
      if (!this.lock) {
        const columnNumber = ~~(
          ((e.clientX - this.root.offsetLeft) / this.root.offsetWidth) *
          col
        );
        if (!this.cells[columnNumber].cellInner.children.length)
          this.columnClickHandlers.forEach((handler) => handler(columnNumber));
      }
    });

    addEventListener("game/win", (e: CustomEvent) => {
      this.lock = true;
      const { cells, winner }: { cells: number[]; winner: string } = e.detail;
      setTimeout(() => {
        cells.forEach((cell) => {
          this.discs[cell]?.classList.add("disc-win");
        });
        this.showModal(winner + " Won");
      }, 150);
    });
  }

  showModal(content: string) {
    document.getElementById("modal-body").innerHTML = content;
    this.gameOverModal.show();
    // const gameEnd = document.getElementById("game-end");
    // gameEnd.className = "position-absolute top-50 start-50 translate-middle modal fade";
    // gameEnd.innerHTML = content;
  }

  addColumnClickHandler(handler: (column: number) => void) {
    this.columnClickHandlers.push(handler);
  }

  addDisc(col: number, row: number) {
    const index = Grid.getIndexAtPosition(col, row, this.colCount);
    const disc = document.createElement("div");
    disc.className = "disc" + (this.num ? " gold" : "");
    disc.style.setProperty("--colOffset", col.toString());
    disc.style.setProperty("--rowOffset", row.toString());
    this.num = 1 - this.num;
    this.grid.prepend(disc);
    this.discs[index] = disc;
    disc.addEventListener("animationend", () => {
      this.cells[index].cellInner.appendChild(disc);
    });
    this.discAdded += 1;

    if (this.discAdded == this.colCount * this.rowCount) {
      if (!this.lock) {
        this.showModal("Draw");
        this.lock = true;
      }
    }
  }
}

type CellType = HTMLDivElement & { cellInner?: HTMLDivElement };
