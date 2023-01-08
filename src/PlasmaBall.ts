import { Black, Blue, Cyan, White } from "./RGB";

import Engine from "./Engine";
import GradientRun from "./GradientRun";

function int(n: number) {
  return Math.round(n);
}

function nextCoord(x: number, y: number, angle: number): [number, number] {
  const sx = int(x);
  const sy = int(y);

  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  let cx = x;
  let cy = y;
  while (true) {
    cx += ca;
    cy += sa;

    if (int(cx) != sx || int(cy) != sy) return [cx, cy];
  }
}

function getKey(x: number, y: number) {
  return x * 1000 + y;
}

function getXY(key: number): [number, number] {
  return [Math.floor(key / 1000), key % 1000];
}

const defaultGradient = new GradientRun([
  [0, Black],
  [1, Blue],
  [2, Cyan],
  [4, White],
]);

export default class PlasmaBall {
  values: Map<number, number>;

  constructor(
    public g: Engine,
    public x: number,
    public y: number,
    public power = 12,
    public gradient = defaultGradient
  ) {
    this.values = new Map();
  }

  float() {
    return this.g.rng.nextFloat();
  }
  range(min: number, max: number) {
    return this.g.rng.nextRange(min, max);
  }

  poke(x: number, y: number, power: number) {
    const key = getKey(int(x), int(y));
    const old = this.values.get(key);

    this.values.set(key, Math.max(old || 0, power));
  }

  draw() {
    this.values.clear();

    let angle = this.float() * 3;
    const arcs = this.range(3, 5);

    for (let i = 0; i < arcs; i++) {
      this.arc(
        this.x,
        this.y,
        this.power / arcs,
        angle,
        (this.float() - 0.5) / 3
      );
      angle += 1 + this.float() * 2;
    }

    for (const [key, power] of this.values) {
      const [x, y] = getXY(key);
      this.g.term.drawChar(x, y, " ", undefined, this.gradient.get(power));
    }
  }

  arc(x: number, y: number, power: number, angle: number, drift: number) {
    if (power <= 0) return;
    this.poke(x, y, power);

    angle += drift;
    const [nx, ny] = nextCoord(x, y, angle);

    if (this.float() < 0.2) {
      // split!
      const mod = this.float();
      power *= 0.6;

      this.arc(nx, ny, power, angle - mod, -drift);
      angle += mod;
    }

    const drain = this.float();
    this.arc(nx, ny, power - drain, angle, drift);
  }
}
