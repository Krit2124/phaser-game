import Phaser from "phaser";

import { Character } from "@/shared/types/character";
import { createCharacterAnimations } from "@/shared/utils/animations";

interface HubSceneConfig {
  selectedCharacter: Character;
}

export class HubScene extends Phaser.Scene {
  private player!: Phaser.Physics.Matter.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>; // Клавиши для управления
  private selectedCharacter: Character;
  private indicator!: Phaser.GameObjects.Text; // Индикатор взаимодействия
  private fallingRocksStartLayer!: Phaser.Tilemaps.TilemapLayer; // Слой fallingRocksStart (активатор мини-игры)

  constructor(config: HubSceneConfig) {
    super("HubScene");
    this.selectedCharacter = config.selectedCharacter;
  }

  preload() {
    // Загружаем тайлы и карту
    this.load.image("AnimTIles", "/assets/maps/AnimTIles.png");
    this.load.image("StaticTiles", "/assets/maps/StaticTiles.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");

    // Загружаем спрайт персонажа
    this.load.spritesheet("character", this.selectedCharacter.sprite, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // Создаём карту
    const map = this.make.tilemap({ key: "map" });
    const animTIles = map.addTilesetImage(
      "AnimTIles",
      "AnimTIles"
    ) as Phaser.Tilemaps.Tileset;
    const staticTiles = map.addTilesetImage(
      "StaticTiles",
      "StaticTiles"
    ) as Phaser.Tilemaps.Tileset;

    // Создаём слои карты
    const waterLayer = map.createLayer("water", [
      animTIles,
      staticTiles,
    ]) as Phaser.Tilemaps.TilemapLayer;

    map.createLayer("floor", [
      animTIles,
      staticTiles,
    ]) as Phaser.Tilemaps.TilemapLayer;

    map.createLayer("smallObjects", [
      animTIles,
      staticTiles,
    ]) as Phaser.Tilemaps.TilemapLayer;

    const objectsLayer = map.createLayer("objects", [
      animTIles,
      staticTiles,
    ]) as Phaser.Tilemaps.TilemapLayer;

    this.fallingRocksStartLayer = map.createLayer("fallingRocksStart", [
      animTIles,
      staticTiles,
    ]) as Phaser.Tilemaps.TilemapLayer;

    // Настраиваем коллизии для слоев
    waterLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(waterLayer);

    objectsLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(objectsLayer);

    this.fallingRocksStartLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(this.fallingRocksStartLayer);

    // Добавляем персонажа
    this.player = this.matter.add.sprite(1135, 1000, "character", 0);
    this.player.setFixedRotation();

    // Анимации персонажа
    createCharacterAnimations(this);

    // Настраиваем управление
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,X") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

    // Настраиваем камеру
    this.cameras.main
      .startFollow(this.player)
      .setZoom(2)
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Добавляем индикатор взаимодействия
    this.indicator = this.add
      .text(this.player.x, this.player.y - 40, "Press X to play", {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000",
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  update() {
    const speed = 3;
    let velocityX = 0;
    let velocityY = 0;
    let animationKey = "";

    // Управление с помощью стрелок и WASD
    if (this.cursors.left?.isDown || this.keys.A.isDown) {
      velocityX = -speed;
      animationKey = "walk-left";
    }
    if (this.cursors.right?.isDown || this.keys.D.isDown) {
      velocityX = speed;
      animationKey = "walk-right";
    }
    if (this.cursors.up?.isDown || this.keys.W.isDown) {
      velocityY = -speed;
      animationKey = "walk-up";
    }
    if (this.cursors.down?.isDown || this.keys.S.isDown) {
      velocityY = speed;
      animationKey = "walk-down";
    }

    // Устанавливаем скорость персонажа
    this.player.setVelocity(velocityX, velocityY);

    // Проигрываем анимацию
    if (velocityX !== 0 || velocityY !== 0) {
      this.player.anims.play(animationKey, true);
    } else {
      this.player.anims.stop();
    }

    // Получаем центр игрока
    const playerCenter = this.player.getCenter();

    // Проверяем расстояние до тайлов fallingRocksStartLayer
    const tileRadius = 2.5; // Радиус в тайлах
    const tileSize = 16; // Размер тайла в пикселях
    let isNear = false;

    this.fallingRocksStartLayer.forEachTile((tile) => {
      if (!tile || !tile.properties.collides) return;

      const tileWorldX = tile.getCenterX();
      const tileWorldY = tile.getCenterY();

      const distance = Phaser.Math.Distance.Between(
        playerCenter.x,
        playerCenter.y,
        tileWorldX,
        tileWorldY
      );

      if (distance <= tileRadius * tileSize) {
        isNear = true;
        this.indicator
          .setPosition(playerCenter.x, playerCenter.y - 40)
          .setVisible(true);
      }
    });

    if (!isNear) {
      this.indicator.setVisible(false);
    }

    // Переход к следующей сцене
    if (isNear && Phaser.Input.Keyboard.JustDown(this.keys.X)) {
      this.scene.start("FallingRocksScene");
    }
  }
}
