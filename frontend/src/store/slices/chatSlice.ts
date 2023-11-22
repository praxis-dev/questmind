// src/store/slices/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface ChatMessage {
  type: "user" | "ai";
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
}

const initialState: ChatState = {
  messages: [],
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
    setInitialMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.messages.length === 0) {
        state.messages.push(action.payload);
      }
    },
  },
});

export const { addMessage, setMessages, clearMessages, setInitialMessage } =
  chatSlice.actions;

export const selectChatMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;
