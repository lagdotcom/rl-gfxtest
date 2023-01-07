import { Colors, Terminal } from "wglt";

import PlasmaBall from "./PlasmaBall";

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

  const ball = new PlasmaBall(term, cols / 2, rows / 2);

  let textColour = Colors.WHITE;

  term.update = () => {
    term.fillRect(0, 0, cols, rows, " ", undefined, 0);
    ball.draw();

    term.drawCenteredString(cols / 2, 4, "!! ELECTRO RAVE !!", textColour);
    textColour = textColour === Colors.WHITE ? Colors.LIGHT_CYAN : Colors.WHITE;
  };
}

window.addEventListener("load", () => loadEngine(document.body));
