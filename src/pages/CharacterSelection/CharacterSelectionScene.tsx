import Phaser from "phaser";

export class CharacterScene extends Phaser.Scene {
  constructor() {
    super("CharacterScene");
  }

  create() {
    this.add.text(400, 300, "Сцена выбора персонажа", {
      fontSize: "32px",
      color: "#ffffff",
    }).setOrigin(0.5, 0.5);
  }
}