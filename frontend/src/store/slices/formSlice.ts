import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormState = "noform" | "signup" | "login" | "recover";

interface IFormSliceState {
  form: FormState;
}

const initialState: IFormSliceState = {
  form: "noform",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormState: (state, action: PayloadAction<FormState>) => {
      state.form = action.payload;
    },
  },
});

export const { setFormState } = formSlice.actions;

export default formSlice.reducer;
