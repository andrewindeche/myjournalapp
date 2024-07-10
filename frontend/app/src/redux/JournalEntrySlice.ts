import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  entries: JournalEntry[];
}

interface JournalState {
  journalEntries: JournalEntry[];
  categoriesWithEntries: Category[];
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JournalState = {
  journalEntries: [],
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchJournalEntries',
  async () => {
    const response = await axios.get('/api/journal-entries/');
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'journal/fetchCategories',
  async () => {
    const response = await axios.get('/api/categories/');
    return response.data;
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createJournalEntry',
  async (newEntry: Omit<JournalEntry, 'id' | 'created_at'>) => {
    const response = await axios.post('/api/journal-entries/', newEntry);
    return response.data;
  }
);

const journalEntriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournalEntries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action: PayloadAction<JournalEntry[]>) => {
        state.status = 'succeeded';
        state.journalEntries = action.payload;
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch journal entries';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createJournalEntry.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
        state.journalEntries.push(action.payload);
      });
  },
});

export default journalEntriesSlice.reducer;

