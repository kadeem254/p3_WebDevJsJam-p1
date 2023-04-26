// Game Variables
import * as GV from "../constants.js";
// Assets
import default_tilesheet from "../assets/default_tilesheet.png";
import atlas from "../assets/atlas.png";
import atlas_json from "../assets/atlas.json";

// Scenes
import MainMenuScene from "./mainMenu.js";

export default class LoadingScene extends Phaser.Scene{
  constructor( ){
    super( GV.SceneKeys.loadingScene );
  }

  /*### CORE FUNCTIONS ###*/

  init(){
    this.load.on(
      "complete", this.__onAssetLoadComplete, this
    )
  }

  preload(){
    this.load.atlas(
      GV.TextureKeys.atlas,
      atlas,
      atlas_json
    )
    this.load.image(
      GV.TextureKeys.tileset_1,
      default_tilesheet
    )
    return;
  }

  /*### HANDLER FUNCTIONS ###*/

  /**Called once all assets are loaded */
  __onAssetLoadComplete(){
    // add the main menu scene
    this.scene.add(
      GV.SceneKeys.mainMenuScene,
      MainMenuScene,
    )
    // TODO: add transitions here

    // go to main Menu scene
    this.scene.start( GV.SceneKeys.mainMenuScene );

    return;
  }

}