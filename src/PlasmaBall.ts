import { Colors, RNG, Terminal, fromRgb } from "wglt";

function int(n: number) {
  return Math.round(n);
}

function lerp(x: number, y: number, a: number) {
  return (1 - a) * x + a * y;
}

function powerToColour(power: number) {
  if (power < 0) return Colors.BLACK;
  if (power > 8) return Colors.WHITE;

  if (power >= 4) {
    const ratio = (power - 4) / 4;
    const r = lerp(0, 255, ratio);
    const g = 255;
    const b = 255;
    return fromRgb(r, g, b);
  }

  const ratio = power / 4;
  const r = 0;
  const g = lerp(0, 255, ratio);
  const b = r;
  return fromRgb(r, g, b);
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

export default class PlasmaBall {
  rng: RNG;
  values: Map<number, number>;

  constructor(
    public term: Terminal,
    public x: number,
    public y: number,
    public power = 20
  ) {
    this.rng = new RNG(Date.now());
    this.values = new Map();
  }

  poke(x: number, y: number, power: number) {
    const key = getKey(int(x), int(y));
    const old = this.values.get(key);

    this.values.set(key, Math.max(old || 0, power));
  }

  draw() {
    this.values.clear();

    let angle = this.rng.nextFloat() * 3;
    const arcs = this.rng.nextRange(3, 5);

    for (let i = 0; i < arcs; i++) {
      this.arc(
        this.x,
        this.y,
        this.power / arcs,
        angle,
        (this.rng.nextFloat() - 0.5) / 3
      );
      angle += 1 + this.rng.nextFloat() * 2;
    }

    for (const [key, power] of this.values) {
      const [x, y] = getXY(key);
      this.term.drawChar(x, y, " ", undefined, powerToColour(power));
    }
  }

  arc(x: number, y: number, power: number, angle: number, drift: number) {
    if (power <= 0) return;
    this.poke(x, y, power);

    angle += drift;
    const [nx, ny] = nextCoord(x, y, angle);

    if (this.rng.nextFloat() < 0.2) {
      // split!
      const mod = this.rng.nextFloat();
      power *= 0.6;

      this.arc(nx, ny, power, angle - mod, -drift);
      angle += mod;
    }

    const drain = this.rng.nextFloat();
    this.arc(nx, ny, power - drain, angle, drift);
  }
}
