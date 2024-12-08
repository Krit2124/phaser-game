import { Character } from "@/shared/types/character";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import maleCharacterImage from "/assets/characters/maleCharacter.png";
import maleSpriteImage from "/assets/characters/maleSprite.png";
import femaleCharacterImage from "/assets/characters/femaleCharacter.png";
import femaleSpriteImage from "/assets/characters/femaleSprite.png";

interface CharacterState {
  selectedCharacter: Character | null;
  characters: Character[];
}

const initialState: CharacterState = {
  selectedCharacter: null,
  characters: [
    { id: "1", name: "Jack", image: maleCharacterImage, sprite: maleSpriteImage },
    { id: "2", name: "Alex", image: femaleCharacterImage, sprite: femaleSpriteImage },
  ],
};

const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    selectCharacter(state, action: PayloadAction<Character>) {
      state.selectedCharacter = action.payload;
    },
  },
});

export const { selectCharacter } = characterSlice.actions;
export default characterSlice.reducer;
