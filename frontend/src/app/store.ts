import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../search/slice.ts';

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});
