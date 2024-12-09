import { FC } from "react";

import { useAppSelector } from "@/shared/hooks/redux";
import { RootState } from "@/shared/store";

import styles from "./index.module.scss"

interface ButtonPlayProps {
  onPlay: () => void
}

export const ButtonPlay: FC<ButtonPlayProps> = ({ onPlay }) => {
  const selectedCharacter = useAppSelector((state: RootState) => state.character.selectedCharacter);

  return (
    <button
      onClick={onPlay}
      disabled={!selectedCharacter}
      className={`${styles.button} ${selectedCharacter ? styles.button_selected : styles.button_common}`}
    >
      Play
    </button>
  );
};

export default ButtonPlay;