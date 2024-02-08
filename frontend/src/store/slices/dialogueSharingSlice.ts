import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogueSharingState {
  isShared: boolean;
  dialogueLink?: string;
}

const initialState: DialogueSharingState = {
  isShared: false,
  dialogueLink: undefined,
};

export const dialogueSharingSlice = createSlice({
  name: "dialogueSharing",
  initialState,
  reducers: {
    setSharedStatus: (state, action: PayloadAction<boolean>) => {
      state.isShared = action.payload;
    },
    setDialogueLink: (state, action: PayloadAction<string | undefined>) => {
      state.dialogueLink = action.payload;
    },
  },
});

export const { setSharedStatus, setDialogueLink } =
  dialogueSharingSlice.actions;

export default dialogueSharingSlice.reducer;
