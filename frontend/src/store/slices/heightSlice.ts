import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeightState {
  value: number;
}

const initialState: HeightState = {
  value: 0,
};

export const heightSlice = createSlice({
  name: "height",
  initialState,
  reducers: {
    setHeight: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setHeight } = heightSlice.actions;

export const selectHeight = (state: { height: HeightState }) =>
  state.height.value;

export default heightSlice.reducer;
