import { Character } from "@/shared/types/character";
import Phaser from "phaser";

interface HubSceneConfig {
  selectedCharacter: Character;
}

export class HubScene extends Phaser.Scene {
  private player!: Phaser.Physics.Matter.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private xKey!: Phaser.Input.Keyboard.Key; // Для перехода на следующую сцену
  private selectedCharacter: Character;
  private indicator!: Phaser.GameObjects.Text; // Индикатор взаимодействия
  private fallingRocksStartLayer!: Phaser.Tilemaps.TilemapLayer; // Слой fallingRocksStart

  constructor(config: HubSceneConfig) {
    super("HubScene");
    this.selectedCharacter = config.selectedCharacter;
  }

  preload() {
    // Загружаем тайлы и карту
    this.load.image("AnimTIles", "/assets/maps/AnimTIles.png");
    this.load.image("StaticTiles", "/assets/maps/StaticTiles.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");

    // Загружаем текстуры персонажа
    this.load.spritesheet("character", this.selectedCharacter.image, {
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
    objectsLayer.setCollisionByProperty({ collides: true });
    this.fallingRocksStartLayer.setCollisionByProperty({ collides: true });

    this.matter.world.convertTilemapLayer(waterLayer);
    this.matter.world.convertTilemapLayer(objectsLayer);
    this.matter.world.convertTilemapLayer(this.fallingRocksStartLayer);

    // Добавляем персонажа
    this.player = this.matter.add.sprite(1135, 1000, "character", 0);
    this.player.setFixedRotation();

    // Настраиваем управление (стрелки и WASD)
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys("W,A,S,D") as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
    };
    this.xKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // Камера следует за персонажем
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2); // Увеличиваем масштаб камеры
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    ); // Устанавливаем границы

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
    const speed = 4;
    let velocityX = 0;
    let velocityY = 0;
  
    // Управление с помощью стрелок и WASD
    if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) velocityX = -speed;
    if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) velocityX = speed;
    if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) velocityY = -speed;
    if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) velocityY = speed;
  
    // Устанавливаем скорость персонажа
    this.player.setVelocity(velocityX, velocityY);
  
    // Разворот персонажа
    if (velocityX > 0) this.player.setFlipX(false); // Смотрит вправо
    if (velocityX < 0) this.player.setFlipX(true); // Смотрит влево
  
    // Получаем центр игрока
    const playerCenter = this.player.getCenter();
  
    // Проверяем расстояние до тайлов fallingRocksStartLayer
    const tileRadius = 2.5; // Радиус в тайлах
    const tileWidth = 16; // Размер тайла в пикселях
    const tileHeight = 16; // Размер тайла в пикселях
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
  
      if (distance <= tileRadius * Math.max(tileWidth, tileHeight)) {
        isNear = true;
        this.indicator.setPosition(playerCenter.x, playerCenter.y - 40).setVisible(true);
      }
    });
  
    if (!isNear) {
      this.indicator.setVisible(false);
    }
  
    // Переход к следующей сцене
    if (isNear && Phaser.Input.Keyboard.JustDown(this.xKey)) {
      this.scene.start("FallingRocksScene"); // Переход к следующей сцене
    }
  }  
}