// store.ts
import { configureStore } from "@reduxjs/toolkit";
import typingReducer from "./slices/typingSlice";
import loadingReducer from "./slices/loadingSlice";

const store = configureStore({
  reducer: {
    typing: typingReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
