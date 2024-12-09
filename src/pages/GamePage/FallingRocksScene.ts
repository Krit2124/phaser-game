import Phaser from "phaser";

import { Character } from "@/shared/types/character";
import { createCharacterAnimations } from "@/shared/utils/animations";

interface FallingRocksConfig {
  selectedCharacter: Character; // Данные о выбранном персонаже
}

export class FallingRocksScene extends Phaser.Scene {
  private player!: Phaser.Physics.Matter.Sprite;
  private selectedCharacter: Character;
  private lives: number = 3;
  private timer!: Phaser.Time.TimerEvent;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private livesText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>; // Клавиши для управления

  constructor(config: FallingRocksConfig) {
    super("FallingRocksScene");
    this.selectedCharacter = config.selectedCharacter;
  }

  preload() {
    // Загружаем тайлы и карту
    this.load.image("StaticTiles", "/assets/maps/StaticTiles.png");
    this.load.tilemapTiledJSON(
      "fallingRocksMap",
      "/assets/maps/fallingRocksMap.json"
    );

    // Загружаем спрайт персонажа
    this.load.spritesheet("character", this.selectedCharacter.sprite, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Загружаем изображение камней
    this.load.image("rock", "/assets/objects/rock.png");
  }

  create() {
    // Создаём карту
    const map = this.make.tilemap({ key: "fallingRocksMap" });
    const staticTiles = map.addTilesetImage("StaticTiles", "StaticTiles")!;

    // Создаём слои карты
    map.createLayer("floor", staticTiles);
    const boundariesLayer = map.createLayer(
      "boundaries",
      staticTiles
    ) as Phaser.Tilemaps.TilemapLayer;

    // Настраиваем коллизии для слоев
    boundariesLayer.setCollisionByProperty({ collides: true });
    boundariesLayer.name = "boundaries";
    this.matter.world.convertTilemapLayer(boundariesLayer);

    // Добавляем персонажа
    this.player = this.matter.add.sprite(320, 320, "character", 0);
    this.player.setFixedRotation();

    // Анимации персонажа
    createCharacterAnimations(this);

    // Настраиваем управление
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,X,R") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

    // Настраиваем камеру
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

    // Создаём событие на спавн камней
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.spawnRock,
      callbackScope: this,
    });

    // Сбрасываем жизней на случай рестарта
    this.lives = 3;

    // Отображаем жизни (выше центра на 10.5 тайлов)
    this.livesText = this.add
      .text(
        this.cameras.main.centerX - 100,
        this.cameras.main.centerY - 168,
        `Lives: ${this.lives}`,
        {
          fontSize: "20px",
          color: "#000000",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Отображаем таймер
    this.timerText = this.add
      .text(
        this.cameras.main.centerX + 100,
        this.cameras.main.centerY - 168,
        `Time: 60`,
        {
          fontSize: "20px",
          color: "#000000",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Интерактивный текст для перезапуска
    this.add
      .text(
        this.cameras.main.centerX - 90,
        this.cameras.main.centerY + 168,
        "R - Restart",
        {
          fontSize: "20px",
          color: "#000000",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .setScrollFactor(0)
      .on("pointerdown", () => this.scene.restart());

    // Интерактивный текст для перехода к предыдущей сцене
    this.add
      .text(
        this.cameras.main.centerX + 90,
        this.cameras.main.centerY + 168,
        "X - Return",
        {
          fontSize: "20px",
          color: "#000000",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .setScrollFactor(0)
      .on("pointerdown", () => this.scene.start("HubScene"));
  }

  update() {
    // Обновляем таймер
    const remainingTime = Math.ceil((this.timer.getRemaining() || 0) / 1000);
    this.timerText.setText(`Time: ${remainingTime}`);

    // Обработка движения игрока
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

    // Перезапуск сцены
    if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
      this.scene.restart();
    }

    // Переход к предыдущей сцене
    if (Phaser.Input.Keyboard.JustDown(this.keys.X)) {
      this.scene.start("HubScene");
    }
  }

  spawnRock() {
    const x = Phaser.Math.Between(192, 448); // Случайная позиция по X (с 12 по 28 тайл)
    const rock = this.matter.add.image(x, 192, "rock");

    rock.setVelocity(0, Phaser.Math.Between(2, 3)); // Скорость падения
    rock.setFriction(0, 0); // Отключаем трение

    // Обработка столкновений с барьерами и игроком
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rock.setOnCollide((pair: any) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      const objectA = bodyA.gameObject;
      const objectB = bodyB.gameObject;

      if (objectA === this.player || objectB === this.player) {
        // Не отнимаем жизни, если время закончилось
        if (this.timer.getRemaining() > 0) {
          this.lives -= 1;
          this.updateLivesUI();
        }
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
        color: "#0000ff",
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
    this.time.removeAllEvents(); // Останавливаем таймеры
    this.matter.world.pause(); // Останавливаем мир
  }

  adjustCameraZoom() {
    // Рассчитываем минимальный зум для отображения 352px (вся игровая зона + минимум тайл с края)
    const widthZoom = this.cameras.main.width / 352;
    const heightZoom = this.cameras.main.height / 352;

    // Выбираем минимальный из двух, чтобы всё помещалось
    const zoom = Math.min(widthZoom, heightZoom);

    this.cameras.main.setZoom(zoom);
  }
}
