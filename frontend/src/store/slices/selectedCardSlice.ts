import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedCardState {
  selectedCardId: string | null;
}

const initialState: SelectedCardState = {
  selectedCardId: null,
};

export const selectedCardSlice = createSlice({
  name: "selectedCard",
  initialState,
  reducers: {
    setSelectedCardId: (state, action: PayloadAction<string | null>) => {
      state.selectedCardId = action.payload;
    },
    clearSelectedCardId: (state) => {
      state.selectedCardId = null;
    },
  },
});

export const { setSelectedCardId, clearSelectedCardId } =
  selectedCardSlice.actions;

export default selectedCardSlice.reducer;
