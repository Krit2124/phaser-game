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
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Управление

  constructor(config: FallingRocksConfig) {
    super("FallingRocksScene");
    this.selectedCharacter = config.selectedCharacter;
  }

  preload() {
    // Загрузка карты
    this.load.image("StaticTiles", "/assets/maps/StaticTiles.png");
    this.load.tilemapTiledJSON(
      "fallingRocksMap",
      "/assets/maps/fallingRocksMap.json"
    );

    // Загрузка персонажа
    this.load.spritesheet("character", this.selectedCharacter.image, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Загрузка камней
    this.load.image("rock", "/assets/objects/rock.png");
  }

  create() {
    this.matter.world.createDebugGraphic();

    // Настройка карты
    const map = this.make.tilemap({ key: "fallingRocksMap" });
    const staticTiles = map.addTilesetImage("StaticTiles", "StaticTiles")!;

    // Создание слоёв
    map.createLayer("floor", staticTiles);
    const boundariesLayer = map.createLayer(
      "boundaries",
      staticTiles
    ) as Phaser.Tilemaps.TilemapLayer;

    boundariesLayer.setCollisionByProperty({ collides: true });
    boundariesLayer.name = "boundaries";
    this.matter.world.convertTilemapLayer(boundariesLayer);

    // Добавление персонажа
    this.player = this.matter.add.sprite(320, 320, "character", 0);
    this.player.setFixedRotation();

    // Управление
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Камера
    this.cameras.main.setScroll(
      320 - this.cameras.main.width / 2,
      320 - this.cameras.main.height / 2
    );
    this.adjustCameraZoom();

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

    // Отображение жизней
    this.add
      .text(16, 16, `Lives: ${this.lives}`, {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setScrollFactor(0);
  }

  update() {
    // Обработка движения игрока
    const speed = 4;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }
  }

  spawnRock() {
    const x = Phaser.Math.Between(192, 448); // Случайная позиция по X (с 12 по 28 тайл)
    const rock = this.matter.add.image(x, 192, "rock");

    rock.setVelocity(0, Phaser.Math.Between(2, 3)); // Скорость падения
    rock.setFriction(0, 0); // Отключаем трение

    // Обработка столкновений с барьерами
    rock.setOnCollide((pair) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      const objectA = bodyA.gameObject;
      const objectB = bodyB.gameObject;

      // Проверка на столкновение с игроком
      if (objectA === this.player || objectB === this.player) {
        this.lives -= 1;
        this.updateLivesUI();
        rock.destroy();

        if (this.lives <= 0) {
          this.onLose();
        }
      } else if (
        objectA.tile?.layer.name === "boundaries" ||
        objectB.tile?.layer.name === "boundaries"
      ) {
        rock.destroy();
      }
    });
  }

  updateLivesUI() {
    this.children.list.forEach((child) => {
      if (
        child instanceof Phaser.GameObjects.Text &&
        child.text.startsWith("Lives")
      ) {
        child.setText(`Lives: ${this.lives}`);
      }
    });
  }

  onWin() {
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Victory!", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    this.time.removeAllEvents(); // Останавливаем таймеры
  }

  onLose() {
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Defeat!", {
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5);
    this.time.removeAllEvents(); // Останавливаем таймеры
    this.matter.world.pause(); // Останавливаем мир
  }

  adjustCameraZoom() {
    // Рассчитываем минимальный зум для отображения 352px
    const widthZoom = this.cameras.main.width / 352;
    const heightZoom = this.cameras.main.height / 352;

    // Выбираем минимальный из двух, чтобы всё помещалось
    const zoom = Math.min(widthZoom, heightZoom);

    this.cameras.main.setZoom(zoom);
  }
}
