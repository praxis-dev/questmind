import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserDialogues } from "../../services/fetchUserDialogues";
import { DialogueSummary } from "../../services/fetchUserDialogues";

interface DialogueIndexState {
  dialogues: DialogueSummary[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DialogueIndexState = {
  dialogues: [],
  status: "idle",
  error: null,
};

export const fetchDialogues = createAsyncThunk(
  "dialogueIndex/fetchDialogues",
  async (_, { rejectWithValue }) => {
    try {
      const dialogues = await fetchUserDialogues();
      return dialogues;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const dialogueIndexSlice = createSlice({
  name: "dialogueIndex",
  initialState,
  reducers: {
    deleteDialogue: (state, action: PayloadAction<string>) => {
      state.dialogues = state.dialogues.filter(
        (dialogue) => dialogue.dialogueId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDialogues.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDialogues.fulfilled,
        (state, action: PayloadAction<DialogueSummary[]>) => {
          state.status = "succeeded";
          state.dialogues = action.payload;
        }
      )
      .addCase(fetchDialogues.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default dialogueIndexSlice.reducer;
