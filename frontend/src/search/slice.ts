import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from './types';

interface SearchState {
    searchResults: Comment[];
}

const initialState: SearchState = {
    searchResults: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchResults(state, action: PayloadAction<Comment[]>) {
            state.searchResults = action.payload;
        },
    },
});

// TODO: need this?
export const { setSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
