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
  private livesText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

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
    this.load.spritesheet("character", this.selectedCharacter.sprite, {
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

    // Анимации
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("character", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("character", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("character", {
        start: 8,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("character", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Управление
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys("W,A,S,D") as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
    };

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

    // Сброс жизней
    this.lives = 3;

    // Отображение жизней (выше центра на 10.5 тайлов)
    this.livesText = this.add
      .text(
        this.cameras.main.centerX - 100,
        this.cameras.main.centerY - 168,
        `Lives: ${this.lives}`,
        {
          fontSize: "20px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Отображение таймера
    this.timerText = this.add
      .text(
        this.cameras.main.centerX + 100,
        this.cameras.main.centerY - 168,
        `Time: 60`,
        {
          fontSize: "20px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Интерактивная кнопка для перезапуска
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 168,
        "Press R to Restart",
        {
          fontSize: "20px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .setScrollFactor(0)
      .on("pointerdown", () => this.scene.restart()); // Перезапуск сцены
  }

  update() {
    // Обновление таймера
    const remainingTime = Math.ceil((this.timer.getRemaining() || 0) / 1000);
    this.timerText.setText(`Time: ${remainingTime}`);

    // Обработка движения игрока
    const speed = 3;
    let velocityX = 0;
    let velocityY = 0;
    let animationKey = "";

    // Управление с помощью стрелок и WASD
    if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
      velocityX = -speed;
      animationKey = "walk-left";
    }
    if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
      velocityX = speed;
      animationKey = "walk-right";
    }
    if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
      velocityY = -speed;
      animationKey = "walk-up";
    }
    if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
      velocityY = speed;
      animationKey = "walk-down";
    }

    // Устанавливаем скорость персонажа
    this.player.setVelocity(velocityX, velocityY);

    // Проигрываем анимацию только если персонаж движется
    if (velocityX !== 0 || velocityY !== 0) {
      this.player.anims.play(animationKey, true);
    } else {
      this.player.anims.stop(); // Останавливаем анимацию, если персонаж стоит
    }

    // Перезапуск сцены
    if (this.input.keyboard!.checkDown(this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R))) {
      this.scene.restart(); // Перезапуск
    }
  }

  spawnRock() {
    const x = Phaser.Math.Between(192, 448); // Случайная позиция по X (с 12 по 28 тайл)
    const rock = this.matter.add.image(x, 192, "rock");

    rock.setVelocity(0, Phaser.Math.Between(2, 3)); // Скорость падения
    rock.setFriction(0, 0); // Отключаем трение

    // Обработка столкновений с барьерами
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rock.setOnCollide((pair: any) => {
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
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  onWin() {
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Victory!", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.time.removeAllEvents(); // Останавливаем таймеры
  }

  onLose() {
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Defeat!", {
        fontSize: "32px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.time.removeAllEvents(); // Останавливаем таймер
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
