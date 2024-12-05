import { Character } from "@/shared/types/character";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import warriorImage from "@/shared/assets/characters/warrior.png"
import mageImage from "@/shared/assets/characters/mage.png"

interface CharacterState {
  selectedCharacter: Character | null;
  characters: Character[];
}

const initialState: CharacterState = {
  selectedCharacter: null,
  characters: [
    { id: "1", name: "Warrior", image: warriorImage },
    { id: "2", name: "Mage", image: mageImage },
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