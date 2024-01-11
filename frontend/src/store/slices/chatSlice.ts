import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
  introMessageAdded: boolean;
}

const initialState: ChatState = {
  messages: [],
  introMessageAdded: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setIntroMessageAdded: (state, action: PayloadAction<boolean>) => {
      state.introMessageAdded = action.payload;
    },
  },
});

export const { addMessage, setMessages, clearMessages, setIntroMessageAdded } =
  chatSlice.actions;

export const selectChatMessages = (state: RootState) => state.chat.messages;

export const selectIntroMessageAdded = (state: RootState) =>
  state.chat.introMessageAdded;

export default chatSlice.reducer;
