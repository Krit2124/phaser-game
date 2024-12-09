import { FC, useEffect, useRef } from "react";
import Phaser from "phaser";

import { HubScene } from "./HubScene";
import { useAppSelector } from "@/shared/hooks/redux";
import { FallingRocksScene } from "./FallingRocksScene";

import styles from "./index.module.scss";

const GamePage: FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const selectedCharacter = useAppSelector(
    (state) => state.character.selectedCharacter
  );

  useEffect(() => {
    // Загружаем сцены, если был выбран персонаж
    if (selectedCharacter) {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameRef.current!,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#83dc6e", // Цвет травы
        scene: [
          new HubScene({ selectedCharacter }),
          new FallingRocksScene({ selectedCharacter }),
        ],
        physics: {
          default: "matter",
          matter: {
            gravity: { y: 0, x: 0 },
          },
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
        },
      });
      return () => {
        game.destroy(true);
      };
    } else {
      window.location.replace("/");
    }
  }, [selectedCharacter]);

  return <div ref={gameRef} className={styles.game} />;
};

export default GamePage;
