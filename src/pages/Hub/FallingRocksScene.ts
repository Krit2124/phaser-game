import Phaser from "phaser";
import { Character } from "@/shared/types/character";

interface FallingRocksConfig {
  selectedCharacter: Character; // Данные о выбранном персонаже
}

export class FallingRocksScene extends Phaser.Scene {
  private player!: Phaser.Physics.Matter.Sprite;
  private selectedCharacter: Character;
  private lives: number = 3;
  private timer!: Phaser.Time.TimerEvent;

  constructor(config: FallingRocksConfig) {
    super("FallingRocksScene");
    this.selectedCharacter = config.selectedCharacter;
  }

  preload() {
    // Загрузка карты
    this.load.image("AnimTiles", "/assets/maps/AnimTiles.png");
    this.load.image("StaticTiles", "/assets/maps/StaticTiles.png");
    this.load.tilemapTiledJSON("fallingRocksMap", "/assets/maps/fallingRocksMap.json");

    // Загрузка персонажа
    this.load.spritesheet("character", this.selectedCharacter.image, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Загрузка камней
    this.load.image("rock", "/assets/objects/rock.png");
  }

  create() {
    // Настройка карты
    const map = this.make.tilemap({ key: "fallingRocksMap" });
    const staticTiles = map.addTilesetImage("StaticTiles", "StaticTiles")!;

    map.createLayer("floor", staticTiles);
    const boundaries = map.createLayer("boundaries", staticTiles) as Phaser.Tilemaps.TilemapLayer;
    boundaries.setCollisionByProperty({ collides: true });

    this.matter.world.convertTilemapLayer(boundaries);

    // Добавление персонажа
    this.player = this.matter.add.sprite(320, 320, "character", 0);
    this.player.setFixedRotation();

    // Камера
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);

    // Таймер на 1 минуту
    this.timer = this.time.addEvent({
      delay: 60000,
      callback: this.onWin,
      callbackScope: this,
    });

    // Спавн камней
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.spawnRock,
      callbackScope: this,
    });
  }

  spawnRock() {
    const x = Phaser.Math.Between(0, this.cameras.main.width); // Случайная позиция по X
    const rock = this.matter.add.image(x, 0, "rock");
    rock.setVelocity(0, Phaser.Math.Between(3, 6)); // Скорость падения
    rock.setOnCollideWith(this.player, () => {
      this.lives -= 1;
      rock.destroy();
      if (this.lives <= 0) this.onLose();
    });
  }

  onWin() {
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Victory!", {
      fontSize: "32px",
      color: "#ffffff",
    }).setOrigin(0.5);
    this.time.removeAllEvents(); // Останавливаем таймеры
  }

  onLose() {
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Defeat!", {
      fontSize: "32px",
      color: "#ff0000",
    }).setOrigin(0.5);
    this.time.removeAllEvents(); // Останавливаем таймеры
    this.matter.world.pause(); // Останавливаем мир
  }
}
