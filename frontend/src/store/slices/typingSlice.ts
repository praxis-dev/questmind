import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TypingState {
  isTyping: boolean;
}

const initialState: TypingState = {
  isTyping: false,
};

const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
});

export const { setIsTyping } = typingSlice.actions;
export default typingSlice.reducer;
