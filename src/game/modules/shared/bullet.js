export default class Bullet extends Phaser.GameObjects.Ellipse{
  constructor( scene, x, y, radius = 10){
    let bulletColor = 0x272727;
    super( scene, x, y, radius, radius, bulletColor);

    this.scene.add.existing( this );
    this.scene.physics.world.enableBody( this, 0 );

    this.lifeSpan = 100;
    this.damage = 1;

    this.setData({
      damage: 1,
      lifeSpan: 5000
    })

    return;
  }

  setLifeSpan( value ){
    if( typeof value != "number" || value <= 100 ){
      this.setData( "lifeSpan", 100 );
    }
    else{
      this.setData( "lifeSpan", value );
    }
    return;
  }

  getLifeSpan(){
    return this.getData( "lifeSpan" );
  }

  /** set damage */
  setDamage( value ){
    if( typeof value != "number" || value <= 0 ){
      this.setData( "damage", 1 );
    }
    else{
      this.setData( "damage", value );
    }
    return;
  }

  getDamage(){
    return this.getData( "damage" );
  }

  /** disable both the visibility and physics body */
  deactivate(){
    this.setVisible( false );
    this.body.enable = false;
    return this;
  }

  /** enable both the visibility and physics body */
  activate(){
    this.setVisible( true );
    this.body.enable = true;
    return this;
  }
}