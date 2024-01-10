import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChunkType = string;

interface CurrentMessageState {
  chunks: ChunkType[];
}

const initialState: CurrentMessageState = {
  chunks: [],
};

const currentMessageSlice = createSlice({
  name: "currentMessage",
  initialState,
  reducers: {
    addChunk(state, action: PayloadAction<ChunkType>) {
      state.chunks.push(action.payload);
    },
    resetChunks(state) {
      state.chunks = [];
    },
  },
});

export const { addChunk, resetChunks } = currentMessageSlice.actions;
export default currentMessageSlice.reducer;
