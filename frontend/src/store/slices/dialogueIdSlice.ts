// dialogueIdSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogueState {
  selectedDialogueId: string | null;
}

const initialState: DialogueState = {
  selectedDialogueId: null,
};

const dialogueSlice = createSlice({
  name: "dialogue",
  initialState,
  reducers: {
    setSelectedDialogueId: (state, action: PayloadAction<string | null>) => {
      state.selectedDialogueId = action.payload;
    },

    clearSelectedDialogueId: (state) => {
      state.selectedDialogueId = null;
    },
  },
});

export const { setSelectedDialogueId, clearSelectedDialogueId } =
  dialogueSlice.actions;
export default dialogueSlice.reducer;
