import Game from "./game";

export default class Connect4 extends Game {
  static COLUMN_COUNT = 7;
  static ROW_COUNT = 6;
  static CONNECT = 4;

  constructor() {
    super(Connect4.COLUMN_COUNT, Connect4.ROW_COUNT, Connect4.CONNECT);
    this.addPlayer("Human");
    this.addPlayer("MiniMax");
  }
}
