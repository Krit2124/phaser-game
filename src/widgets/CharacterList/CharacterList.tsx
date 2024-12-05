import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { RootState } from "@/shared/store";
import { selectCharacter } from "@/shared/store/reducers/character/characterSlice";
import { FC } from "react";

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
    <div>
      <h2>Выберите персонажа:</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => handleSelect(char)}
            style={{
              border:
                selectedCharacter?.id === char.id
                  ? "2px solid green"
                  : "1px solid gray",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            <img
              src={char.image}
              alt={char.name}
              style={{ width: "100px", height: "100px" }}
            />
            <p>{char.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;
