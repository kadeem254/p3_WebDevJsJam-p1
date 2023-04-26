import StartGame from "./game/game";

let __Game;

window.addEventListener(
  "load", init
)

function init(){
  __Game = StartGame();
  return;
}