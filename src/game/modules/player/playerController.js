import Character from "../shared/character";

export default class PlayerController{
  constructor( scene, player ){
    if( scene instanceof Phaser.Scene === false ){
      throw new Error( "scene must be of type Phaser.Scene" );
    }
    this.scene = scene;

    if( player instanceof Character === false ){
      throw new Error( "player must be of type Character" );
    }
    this.player = player;

    this.movement = new Phaser.Math.Vector2( 0, 0 );

    return this;
  }

  update(){

  }

  movePlayer(){
  }
}