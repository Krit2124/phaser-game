import { useAppSelector } from "@/shared/hooks/redux";
import { RootState } from "@/shared/store";
import { FC } from "react";

interface ButtonPlayProps {
  onPlay: () => void
}

export const ButtonPlay: FC<ButtonPlayProps> = ({ onPlay }) => {
  const selectedCharacter = useAppSelector((state: RootState) => state.character.selectedCharacter);

  return (
    <button
      onClick={onPlay}
      disabled={!selectedCharacter}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        background: selectedCharacter ? "green" : "gray",
        color: "white",
        cursor: selectedCharacter ? "pointer" : "not-allowed",
      }}
    >
      Играть
    </button>
  );
};

export default ButtonPlay;