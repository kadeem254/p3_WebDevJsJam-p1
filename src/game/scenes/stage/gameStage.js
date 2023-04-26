import * as GV from "../../constants.js";
import Player from "../../modules/player/player.js";
import Bullet from "../../modules/shared/bullet.js";

const PlayerAnimations = {
  idle: "player_idle",
  walk: "player_walk",
  idle_gun: "player_idle_gun",
  walk_gun: "player_walk_gun",
};

export default class GameStageScene extends Phaser.Scene {
  constructor(key = GV.SceneKeys.stageScene) {
    super(key);
  }

  /*### CORE FUNCTIONS ###*/
  init() {}

  create() {
    // temp bounds floor
    this.add
      .rectangle(0, 0, GV.Resolution.width, GV.Resolution.height, 0xff6400)
      .setOrigin(0);

    // create variables for the scene
    this.createSceneVariables();

    this.cameras.main.setBackgroundColor(0x8ecae6);
    this.generateSpritesheets();

    this.createPlayer();

    this.createKeyboardInputs();
    this.createSceneInputHandlers();

    this.createAimRecticle();
    this.createBulletManager();

    this.gunFireManager();

    return;
  }

  update( time, delta ) {
    this.updatePlayerInput();
    this.updateBulletGroup( delta );
    return;
  }

  createAimRecticle() {
    // this.obj_recticle = this.add.circle(0, 0, 20, 0xff0000);
    this.obj_recticle = this.add.sprite(
      this.input.mousePointer.x,
      this.input.mousePointer.y,
      GV.TextureKeys.crosshair,
      0
    );

    // create pulse animation;
    this.obj_recticle.anims.create({
      key: "crosshair_pulse",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNames(GV.TextureKeys.crosshair, {
        start: 0,
        end: 1,
      }),
    });

    this.obj_recticle.play("crosshair_pulse");

    return;
  }

  createBulletManager() {
    this.grp_bulletManger = this.physics.add.group({
      maxSize: 100,
    });

    // console.log( this.grp_bulletManger.getLength() );

    return;
  }

  createKeyboardInputs() {
    this.ctrls_keyboard = this.input.keyboard.addKeys(
      "W,A,S,D,UP,LEFT,RIGHT,DOWN"
    );

    return;
  }

  createPlayer() {
    // new player object
    this.obj_player = new Player(this, 100, 100, GV.TextureKeys.player, 1);
    this.obj_player.setCollideWorldBounds(true);

    // create player animations
    this.createPlayerAnimations();

    // player inputs
    this.input_playerDirection = new Phaser.Math.Vector2(0, 0);

    // set camera follow
    let lerp = this.data.get("cameraLerp");
    let zoom = this.data.get("cameraZoom");
    this.cameras.main.setZoom(zoom);
    this.cameras.main.startFollow(this.obj_player, false, lerp, lerp);

    return;
  }

  createPlayerAnimations() {
    // idle animation
    this.obj_player.anims.create({
      key: PlayerAnimations.idle_gun,
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers(GV.TextureKeys.player, {
        start: 2,
        end: 3,
      }),
    });

    // idle animation
    this.obj_player.anims.create({
      key: PlayerAnimations.walk_gun,
      frameRate: 6,
      repeat: -1,
      frames: this.anims.generateFrameNumbers(GV.TextureKeys.player, {
        start: 8,
        end: 11,
      }),
    });

    return;
  }

  createSceneInputHandlers() {
    this.input.on("pointermove", this._onMouseMoveHandler, this);
    return;
  }

  createSceneVariables() {
    const vars = {
      pointer: {
        x: this.input.mousePointer.x,
        y: this.input.mousePointer.y,
      },
      canUpdatePlayerRotation: true,
      cameraZoom: 1.5,
      cameraLerp: 0.1,
      playerCanFire: true,
      bulletUpdateCounter: 1000,
      bulletUpdateDelay: 1000,
    };

    this.data.set(vars);
    return;
  }

  fireGun() {

    if( this.grp_bulletManger.countActive() == this.grp_bulletManger.maxSize ){
      return;
    }

    this.data.set("playerCanFire", false);

    // spawn bullet at player
    let bullet = this.grp_bulletManger.getFirstDead(
      false,
      this.obj_player.x,
      this.obj_player.y
    );


    // check if any active bullets in the
    if (bullet === null) {
      bullet = new Bullet(this, this.obj_player.x, this.obj_player.y);
      this.grp_bulletManger.add( bullet );
    }

    // set bullet properties
    bullet.active = true;
    bullet.visible = true
    this.physics.world.enable( bullet );
    bullet.lifeSpan = GV.PlayerDefaults.bulletLifespan;

    // fire bullet towards
    let bulletSpeed = GV.PlayerDefaults.bulletSpeed;
    let vel = this.physics.velocityFromRotation(
      this.obj_player.rotation,
      bulletSpeed
    );
    bullet.body.setVelocity(vel.x, vel.y);

    return;
  }

  gunFireManager(){
    // check if player can fire
    if (this.data.get("playerCanFire") == false) {
      return;
    }

    // fire the gun
    console.log( "fire bullet" );
    this.fireGun();

    // set cooldown for next bullet fired
    this.time.delayedCall(
      GV.PlayerDefaults.fireSpeed,
      () => {
        this.data.set("playerCanFire", true);
        this.gunFireManager();
        return;
      },
      undefined,
      this
    );

    return;
  }

  generateSpritesheets() {
    // player
    this.textures.addSpriteSheetFromAtlas(GV.TextureKeys.player, {
      atlas: GV.TextureKeys.atlas,
      frame: GV.AtlasKeys.player,
      frameWidth: 64,
      frameHeight: 64,
    });

    // crosshair

    this.textures.addSpriteSheetFromAtlas(GV.TextureKeys.crosshair, {
      atlas: GV.TextureKeys.atlas,
      frame: GV.AtlasKeys.crosshair,
      frameWidth: 64,
      frameHeight: 64,
    });

    return;
  }

  getPlayerAngle() {
    // debounce angle update
    if (this.data.get("canUpdatePlayerRotation") == false) {
      return;
    }

    // face the player towards the last known pointer location.
    // let pointer = this.data.get("pointer");

    // point the player towards the recticle
    let radians = Phaser.Math.Angle.BetweenPoints(
      this.obj_player,
      this.obj_recticle
    );

    this.obj_player.setRotation(radians);

    return;
  }

  movePlayer() {
    // exit if no input
    if (this.input_playerDirection.equals(Phaser.Math.Vector2.ZERO)) {
      this.obj_player.play(PlayerAnimations.idle_gun, true);
      this.obj_player.setVelocity(0);
      return;
    }

    this.obj_player.play(PlayerAnimations.walk_gun, true);

    let normalized = this.input_playerDirection.normalize();

    this.obj_player.setVelocity(
      normalized.x * GV.PlayerDefaults.speed,
      normalized.y * GV.PlayerDefaults.speed
    );

    this.updateAimRecticle();
    this.getPlayerAngle();

    return;
  }

  updateAimRecticle() {
    let pointer = this.data.get("pointer");
    let cam = this.cameras.main;
    let zoom = this.data.get("cameraZoom");

    this.obj_recticle.setPosition(
      pointer.x / zoom + cam.midPoint.x - cam.displayWidth / 2,
      pointer.y / zoom + cam.midPoint.y - cam.displayHeight / 2
    );

    return;
  }

  updateBulletGroup(delta) {
    // check if can update
    if (this.data.get("bulletUpdateCounter") > 0) {
      this.data.set(
        "bulletUpdateCounter",
        this.data.get("bulletUpdateCounter") - delta
      );
      return;
    }

    // set new update delay
    this.data.set(
      "bulletUpdateCounter",
      this.data.get("bulletUpdateDelay")
    );

    // console.log( "update group" );

    let activeBullets = this.grp_bulletManger.getMatching(
      "active", true,
    );

    // console.log( activeBullets );

    activeBullets.forEach(
      bullet => {
        if( bullet.lifeSpan == undefined ){
          bullet.lifeSpan = GV.PlayerDefaults.bulletLifespan;
          return;
        }

        bullet.lifeSpan -= this.data.get( "bulletUpdateDelay" );

        if( bullet.lifeSpan <= 0 ){
          bullet.active = false;
          bullet.visible = false;
          this.physics.world.disable( bullet );
        }

        return;
      }
    )
    

    return;
  }

  updatePlayerInput() {
    let x = 0;
    let y = 0;

    if (this.ctrls_keyboard["A"].isDown || this.ctrls_keyboard["LEFT"].isDown)
      x -= 1;

    if (this.ctrls_keyboard["D"].isDown || this.ctrls_keyboard["RIGHT"].isDown)
      x += 1;

    if (this.ctrls_keyboard["W"].isDown || this.ctrls_keyboard["UP"].isDown)
      y -= 1;

    if (this.ctrls_keyboard["S"].isDown || this.ctrls_keyboard["DOWN"].isDown)
      y += 1;

    this.input_playerDirection.set(x, y);

    this.movePlayer();

    return;
  }

  _onMouseMoveHandler(pointer) {
    // update pointer location
    this.data.set("pointer", {
      x: pointer.x,
      y: pointer.y,
    });

    this.updateAimRecticle();
    //
    // let cam = this.cameras.main;
    // let zoom = this.data.get( "cameraZoom" );
    // this.obj_recticle.setPosition(
    //   pointer.x / zoom + cam.midPoint.x - cam.displayWidth / 2,
    //   pointer.y / zoom + cam.midPoint.y - cam.displayHeight / 2
    // )

    // console.log(
    //   `pointer = x${this.obj_recticle.x}, y: ${this.obj_recticle.y}`
    // );

    // console.log(`
    // mouse -> x: ${this.input.mousePointer.x}, y: ${this.input.mousePointer.y},
    // pointer -> x: ${pointer.x}, y: ${pointer.y},
    // `)

    this.getPlayerAngle();
    return;
  }
}
