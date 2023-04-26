export default class Character extends Phaser.Physics.Arcade.Sprite{
  constructor( scene, x, y, texture, frame ){
    super( scene, x, y, texture, frame );

    this.scene.add.existing( this );
    this.scene.physics.world.enableBody( this, 0 );

    this.setSize( 32, 32   );
    this.invincibilityTimer = this.scene.time.addEvent({
      callback: this._onInvincibilityEnded,
      callbackScope: this
    })

    this.setData({
      isAlive: true,
      invincible: false,
      health: 10,
      invincibilityCooldown: 750
    })

    return;
  }

  _onInvincibilityEnded(){
    this.setData( "" )
    return;
  }
  
  setHealth( value ){
    if( typeof value != "number" || value < 0 ) return;

    this.setData( "health", value );
    return;
  }

  setinvincibilityDuration( value ){
    if( typeof value != "number" || value < 0 ) return;

    this.setData( "invincibilityCooldown", value );
    return;
  }

  isAlive(){
    return this.getData( "isAlive" );
  }

  kill(){
    this.setData( "isAlive", false );
    this.health = 0;
    return;
  }

  takeDamage( value ){
    if( 
      typeof value != "number" ||
      this.getData("invincible")
    ) return false;

    let newHealth = this.health - value;

    // reduce health on new health
    if( this.newHealth <= 0 ){
      this.kill();
      this.health = 0;
    }
    else{
      this.health = newHealth;
    }

    // set can take damage to false
    this.setData( "invincible", true );

    // start timer to remove invincibility
    this.invincibilityTimer.reset();
    
    return true;
  }

  takeDamage(){

  }
}