import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { RootState } from "@/shared/store";
import { selectCharacter } from "@/shared/store/reducers/character/characterSlice";
import { FC } from "react";

import styles from "./index.module.scss";

const CharacterList: FC = () => {
  const dispatch = useAppDispatch();
  const characters = useAppSelector(
    (state: RootState) => state.character.characters
  );
  const selectedCharacter = useAppSelector(
    (state: RootState) => state.character.selectedCharacter
  );

  const handleSelect = (character: (typeof characters)[0]) => {
    dispatch(selectCharacter(character));
  };

  return (
    <div className={styles.selection}>
      {characters.map((char) => (
        <div
          key={char.id}
          onClick={() => handleSelect(char)}
          className={`${styles.character} ${selectedCharacter?.id === char.id ? styles.character_selected : styles.character_common}`}
        >
          <img
            src={char.image}
            alt={char.name}
          />
          <p>{char.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CharacterList;
