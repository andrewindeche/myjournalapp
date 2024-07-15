import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import instance, { setAuthToken } from "../redux/axiosInstance";
import { RootState } from "./store";
import { logout } from "../redux/authSlice";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  type: "text" | "image";
  category: string;
}

interface Category {
  id: number;
  name: string;
  entries: JournalEntry[];
}

interface JournalState {
  journalEntries: JournalEntry[];
  categoriesWithEntries: Category[];
  mostRecentEntry: JournalEntry | null;
  categories: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JournalState = {
  journalEntries: [],
  categoriesWithEntries: [],
  categories: [],
  mostRecentEntry: null,
  status: "idle",
  error: null,
};

export const fetchJournalEntries = createAsyncThunk(
  "journal/fetchJournalEntries",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.get("entries-create/");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue(
          "Unauthorized. Failed to fetch journal entries.",
        );
      }
      return rejectWithValue("Failed to fetch journal entries.");
    }
  },
);

export const updateJournalEntry = createAsyncThunk(
  "journal/updateJournalEntry",
  async (
    updatedEntry: JournalEntry,
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.put(`entries-create/${updatedEntry.id}/`, updatedEntry);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized. Error updating entry.");
      }
      return rejectWithValue("Error updating entry.");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "journal/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.get("categories-create/");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized. Failed to fetch categories.");
      }
      return rejectWithValue("Failed to fetch categories.");
    }
  },
);

export const deleteJournalEntry = createAsyncThunk(
  "journal/deleteJournalEntry",
  async (entryId: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      await instance.delete(`entries-update/${entryId}/`);
      return entryId; 
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized. Error deleting entry.");
      }
      return rejectWithValue("Error deleting entry.");
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  "journal/createJournalEntry",
  async (
    newEntry: Omit<JournalEntry, "id" | "created_at">,
    { getState, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.post("entries-create/", newEntry);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized. Error creating new entry.");
      }
      return rejectWithValue("Error creating new entry.");
    }
  },
);

const journalEntriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournalEntries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchJournalEntries.fulfilled,
        (state, action: PayloadAction<JournalEntry[]>) => {
          state.status = "succeeded";
          state.journalEntries = action.payload;
          if (action.payload.length > 0) {
            state.mostRecentEntry = action.payload[action.payload.length - 1];
          }
        },
      )
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (state.error === "Unauthorized. Error fetching Journals.") {
          logout();
        }
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.status = "succeeded";
          state.categories = action.payload;
        },
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (state.error === "Unauthorized. Error fetching categories.") {
          logout();
        }
      })
      .addCase(
        createJournalEntry.fulfilled,
        (state, action: PayloadAction<JournalEntry>) => {
          state.journalEntries.push(action.payload);
          state.mostRecentEntry = action.payload;
        },
      )
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (state.error === "Unauthorized. Error Creating Entries.") {
          logout();
        }
      })
      .addCase(
        deleteJournalEntry.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.journalEntries = state.journalEntries.filter(entry => entry.id !== action.payload);
          if (state.mostRecentEntry?.id === action.payload) {
            state.mostRecentEntry = null;
          }
        }
      )
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (state.error === "Unauthorized. Error deleting entry.") {
          logout();
        }
      })
      .addCase(
        updateJournalEntry.fulfilled,
        (state, action: PayloadAction<JournalEntry>) => {
          const index = state.journalEntries.findIndex(entry => entry.id === action.payload.id);
          if (index !== -1) {
            state.journalEntries[index] = action.payload;
            state.mostRecentEntry = action.payload;
          }
        }
      )
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (state.error === "Unauthorized. Error updating entry.") {
          logout();
        }
      });
  },
});

export const { addCategory } = journalEntriesSlice.actions;

export const selectCategories = (state: RootState) => state.entries.categories;

export default journalEntriesSlice.reducer;
