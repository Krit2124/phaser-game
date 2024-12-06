import { ButtonPlay } from "@/shared/ui/ButtonPlay";
import { CharacterList } from "@/widgets/CharacterList";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const CharacterSelectionPage: FC = () => {
const navigate = useNavigate();

  const handlePlay = () => {
    navigate("/hub");
  };

  return (
    <div>
      <CharacterList />
      <ButtonPlay onPlay={handlePlay} />
    </div>
  );
};

export default CharacterSelectionPage;
