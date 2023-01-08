import RGB from "./RGB";
import { fromRgb } from "wglt";
import lerp from "./lerp";

type GradientPoint = [breakpoint: number, rgb: RGB];

export default class GradientRun {
  constructor(public points: GradientPoint[]) {
    this.sort();
  }

  private sort() {
    this.points.sort(([a], [b]) => a - b);
  }

  add(breakpoint: number, rgb: RGB): this {
    this.points.push([breakpoint, rgb]);
    this.sort();
    return this;
  }

  get(value: number) {
    const [low, lowColour] = this.points[0];
    if (value <= low) return fromRgb(...lowColour);

    const [high, highColour] = this.points[this.points.length - 1];
    if (value >= high) return fromRgb(...highColour);

    const higherIndex = this.points.findIndex(([p]) => p > value);
    const [below, [ar, ag, ab]] = this.points[higherIndex - 1];
    const [above, [br, bg, bb]] = this.points[higherIndex];

    const r = (value - below) / (above - below);
    return fromRgb(lerp(ar, br, r), lerp(ag, bg, r), lerp(ab, bb, r));
  }
}
