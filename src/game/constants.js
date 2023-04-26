export const Resolution = {
  width: 1280,
  height: 720
}

export const SceneKeys = {
  loadingScene: "loadingScene",
  mainMenuScene: "mainMenuScene",
  stageScene: "stageScene",
  stageUiScene: "stageUiScene",
  gameOverScene: "gameOverScene"
}

export const AtlasKeys = {
  player: "atlas/player",
  zombie: "atlas/zombie",
  car: "atlas/car",

  smoke: "atlas/smoke",

  button_large: "atlas/button_L",
  button_small: "atlas/button_S",
  crosshair: "atlas/crosshair",

  forward: "atlas/forward",
  pause: "atlas/pause",
  close: "atlas/cross",
  restart: "atlas/restart",
  menu: "atlas/menu",
}

export const TextureKeys = {
  atlas: "atlas",

  player: "player",
  zombie: "zombie",
  car: "car",

  smoke: "smoke",

  button_large: "button_L",
  button_small: "button_S",
  crosshair: "crosshair",

  forward: "forward",
  pause: "pause",
  close: "cross",
  restart: "restart",
  menu: "menu",

  tileset_1: "default_tileset"
}

export const TilesetKeys = {
  tileset_1: "default_tileset"
}

export const PlayerDefaults = {
  health: 10,
  speed: 128,
  bulletSpeed: 128 * 5,
  bulletLifespan: 3000,
  fireSpeed: 400, // a bullet every x time
}