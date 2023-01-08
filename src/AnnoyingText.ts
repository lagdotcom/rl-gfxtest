import { Colors, Terminal } from "wglt";

import Drawable from "./Drawable";

export default class AnnoyingText implements Drawable {
  flash: boolean;

  constructor(
    public term: Terminal,
    public x: number,
    public y: number,
    public text: string
  ) {
    this.flash = false;
  }

  draw() {
    this.flash = !this.flash;

    this.term.drawCenteredString(
      this.x,
      this.y,
      this.text,
      this.flash ? Colors.WHITE : Colors.LIGHT_CYAN
    );
  }
}
