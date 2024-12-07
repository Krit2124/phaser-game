import { FC, useEffect, useRef } from "react";
import Phaser from "phaser";
import { HubScene } from "./HubScene";
import { useAppSelector } from "@/shared/hooks/redux";
import { FallingRocksScene } from "./FallingRocksScene"; // Импорт сцены

const HubPage: FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const selectedCharacter = useAppSelector(
    (state) => state.character.selectedCharacter
  );

  useEffect(() => {
    if (selectedCharacter) {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameRef.current!,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [
          new HubScene({ selectedCharacter }), // Первая сцена
          new FallingRocksScene({ selectedCharacter }), // Вторая сцена
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

  return <div ref={gameRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default HubPage;
