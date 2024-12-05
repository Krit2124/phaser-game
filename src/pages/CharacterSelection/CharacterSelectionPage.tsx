import { ButtonPlay } from "@/shared/ui/ButtonPlay";
import { CharacterList } from "@/widgets/CharacterList";
import { FC } from "react";

const CharacterSelectionPage: FC = () => {
  const handlePlay = () => {
    console.log("Переход ко второй сцене");
    // Здесь будет логика перехода к следующей сцене.
  };

  return (
    <div>
      <CharacterList />
      <ButtonPlay onPlay={handlePlay} />
    </div>
  );
};

export default CharacterSelectionPage;
