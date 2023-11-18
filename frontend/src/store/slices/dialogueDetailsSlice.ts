import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Dialogue } from "../../services/fetchDialogueById";

interface DialogueState {
  selectedDialogue: Dialogue | null;
}

const initialState: DialogueState = {
  selectedDialogue: null,
};

const dialogueDetailsSlice = createSlice({
  name: "dialogueDetails",
  initialState,
  reducers: {
    setSelectedDialogue: (state, action: PayloadAction<Dialogue | null>) => {
      state.selectedDialogue = action.payload;
    },

    clearSelectedDialogue: (state) => {
      state.selectedDialogue = null;
    },
  },
});

export const { setSelectedDialogue, clearSelectedDialogue } =
  dialogueDetailsSlice.actions;
export default dialogueDetailsSlice.reducer;
