import { Black, Green, Red, White, Yellow } from "./RGB";

import AnnoyingText from "./AnnoyingText";
import Engine from "./Engine";
import GradientRun from "./GradientRun";
import PlasmaBall from "./PlasmaBall";
import { Terminal } from "wglt";

function loadEngine(parent: HTMLElement) {
  const cols = 60;
  const rows = 40;

  const container = document.createElement("div");
  parent.appendChild(container);
  const onResize = () => {
    const wantWidth = cols * 8;
    const wantHeight = rows * 8;

    const ratioWidth = Math.floor(window.innerWidth / wantWidth);
    const ratioHeight = Math.floor(window.innerHeight / wantHeight);
    const ratio = Math.min(ratioWidth, ratioHeight);

    container.style.width = `${wantWidth * ratio}px`;
    container.style.height = `${wantHeight * ratio}px`;
  };
  window.addEventListener("resize", onResize);
  onResize();

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const term = new Terminal(canvas, cols, rows, { maxFps: 10 });
  const g = new Engine(term);
  g.add(new PlasmaBall(g, cols / 4 - 5, rows / 2 - 5));
  g.add(
    new PlasmaBall(
      g,
      (cols / 4) * 2,
      rows / 2 + 5,
      12,
      new GradientRun([
        [0, Black],
        [1, Red],
        [2, Yellow],
        [4, White],
      ])
    )
  );
  g.add(
    new PlasmaBall(
      g,
      (cols / 4) * 3 + 5,
      rows / 2 - 5,
      12,
      new GradientRun([
        [0, Black],
        [1, Green],
        [2, Yellow],
        [4, White],
      ])
    )
  );
  g.add(new AnnoyingText(term, cols / 2, 4, "!! ELECTRO RAVE !!"));
}

window.addEventListener("load", () => loadEngine(document.body));
