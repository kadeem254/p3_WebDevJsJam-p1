import Phaser from "phaser";
import * as GV from "./constants";
import LoadingScene from "./scenes/loadingScreen";

export default function StartGame(){
  const game = new Phaser.Game({
    type: Phaser.AUTO,

    width: GV.Resolution.width,
    height: GV.Resolution.height,
    parent: document.getElementById("game-container"),

    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [ LoadingScene ],
    physics: {
      default: "arcade",
      arcade: {
        debug: true
      }
    }
  })

  return game;
}