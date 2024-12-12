export function createCharacterAnimations(scene: Phaser.Scene) {
  const animations = [
    { key: "walk-down", frames: { start: 0, end: 3 } },
    { key: "walk-left", frames: { start: 4, end: 7 } },
    { key: "walk-right", frames: { start: 8, end: 11 } },
    { key: "walk-up", frames: { start: 12, end: 15 } },
  ];

  animations.forEach(({ key, frames }) => {
    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers("character", frames),
      frameRate: 10,
      repeat: -1,
    });
  });
}

export function createRocksAnimations(scene: Phaser.Scene) {
  scene.anims.create({
    key: "fallingRock",
    frames: scene.anims.generateFrameNumbers("rock", { start: 0, end: 11 }),
    frameRate: 10,
    repeat: -1,
  });
}
