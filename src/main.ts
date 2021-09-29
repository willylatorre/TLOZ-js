import { Game } from "./ts/Game";

let button = document.getElementById("startButton");
let hint = document.getElementById("hint");
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let game;

button!.addEventListener("click", () => {
  game = new Game(canvas);
  game.run();
  hint.remove();
}, { once: true });
