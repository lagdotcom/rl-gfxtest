import { RNG, Terminal } from "wglt";

import Drawable from "./Drawable";

export default class Engine {
  rng: RNG;

  constructor(public term: Terminal, public objects: Drawable[] = []) {
    this.rng = new RNG(Date.now());
    term.update = this.onUpdate.bind(this);
  }

  add(object: Drawable): this {
    this.objects.push(object);
    return this;
  }

  onUpdate() {
    this.term.fillRect(
      0,
      0,
      this.term.width,
      this.term.height,
      " ",
      undefined,
      0
    );
    for (const thing of this.objects) thing.draw();
  }
}
