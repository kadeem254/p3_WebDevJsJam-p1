import * as GV from "../constants.js";
import GameStageScene from "./stage/gameStage.js";

export default class MainMenuScene extends Phaser.Scene{
  constructor( key = GV.SceneKeys.mainMenuScene ){
    super( key );
  }

  /*### CORE FUNCTIONS ###*/
  init(){
    // remove loading scene from scene manager
    this.scene.remove( GV.SceneKeys.loadingScene );

    // create game stage scene, pause scene and stage ui scene
    this.scene.add(
      GV.SceneKeys.stageScene, GameStageScene
    );

    return;
  }

  create(){
    // define custom events
    this.defineSceneEvents();

    // camera settings
    this.cameras.main.setBackgroundColor( 0xff6400 );

    // build ui
    this.generateSpriteSheets();
    this.createMenuUI();

    // ui interactions
    this.defineUIInteractions();

    return;
  }

  /*### SCENE HANDLER FUNCTIONS ###*/

  __onStartGameEvent(){
    // disable event
    this.events.removeListener(
      "start_game",
      this.__onStartGameEvent,
      this
    )

    // start game event
    let data = {};
    this.scene.start( GV.SceneKeys.stageScene, data );

    return;
  }

  /*### MODULAR FUNCTIONS ###*/
  generateSpriteSheets(){
    // large button
    this.textures.addSpriteSheetFromAtlas(
      GV.TextureKeys.button_large,
      {
        atlas: GV.TextureKeys.atlas,
        frame: GV.AtlasKeys.button_large,
        frameWidth: 190,
        frameHeight: 49
      }
    )

    // small button
    this.textures.addSpriteSheetFromAtlas(
      GV.TextureKeys.button_small,
      {
        atlas: GV.TextureKeys.atlas,
        frame: GV.AtlasKeys.button_small,
        frameWidth: 49,
        frameHeight: 49
      }
    )

    return;
  }

  createMenuUI(){
    this.btn_startGame = this.add.sprite(
      GV.Resolution.width / 2,
      200,
      // GV.TextureKeys.button_large,
      GV.TextureKeys.button_large,
      1
    );
    this.btn_startGame.setScale( 2 );


    return;
  }

  /**Create events to be used by this scene */
  defineSceneEvents(){
    // game start event
    this.events.addListener(
      "start_game",
      this.__onStartGameEvent,
      this
    );

    return;
  }

  /**Define what happens when given aspects of
   * the ui are interacted with
   */
  defineUIInteractions(){
    this.btn_startGame.setInteractive();
    this.btn_startGame.on(
      "pointerdown", this._onStartGameButtonDown, this
    )


    return;
  }

  /**What to do when the start game button is clicked*/
  _onStartGameButtonDown(){
    // disable pointer down event
    this.btn_startGame.off(
      "pointerdown", this._onStartGameButtonDown, this
    )
    
    // enable ponter out event
    this.btn_startGame.on(
      "pointerout", this._onStartGameButtonOut, this
    )

    // enable ponter up event
    this.btn_startGame.on(
      "pointerup", this._onStartGameButtonUp, this
    )

    // EVENT ACTIONS
    this.btn_startGame.setFrame( 0 );

    return;
  }

  _onStartGameButtonUp(){
    // disable pointer up event
    this.btn_startGame.off(
      "pointerup", this._onStartGameButtonUp, this
    )

    // disable pointer out event
    this.btn_startGame.off(
      "pointerout", this._onStartGameButtonOut, this
    )

    // enable pointer down event
    this.btn_startGame.on(
      "pointerdown", this._onStartGameButtonDown, this
    )

    // EVENT ACTIONS
    this.btn_startGame.setFrame( 1 );
    this.events.emit( "start_game" );

    return;
  }

  _onStartGameButtonOut(){
    // disable pointer out event
    this.btn_startGame.off(
      "pointerout", this._onStartGameButtonOut, this
    );

    // disable pointer up event
    this.btn_startGame.off(
      "pointerup", this._onStartGameButtonUp, this
    );

    // enable pointer down event
    this.btn_startGame.on(
      "pointerdown", this._onStartGameButtonDown, this
    )

    // EVENT ACTIONS
    this.btn_startGame.setFrame( 1 );

    return;
  }

}