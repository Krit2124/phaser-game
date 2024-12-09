import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ButtonPlay } from "@/shared/ui/ButtonPlay";
import { CharacterList } from "@/widgets/CharacterList";

import styles from './index.module.scss'

const CharacterSelectionPage: FC = () => {
const navigate = useNavigate();

  const handlePlay = () => {
    navigate("/game");
  };

  return (
    <div className={styles.page}>
      <h1>Choose a character:</h1>
      <CharacterList />
      <ButtonPlay onPlay={handlePlay} />
    </div>
  );
};

export default CharacterSelectionPage;
