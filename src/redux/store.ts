import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/features/users/userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,

  },
});

// ✅ Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
