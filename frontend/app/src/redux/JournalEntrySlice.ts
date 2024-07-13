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
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    console.log("FetchJournalsToken:", token);
    setAuthToken(token);
    try {
      const mostRecentEntry = await dispatch(fetchMostRecentEntry()).unwrap();
      const response = await instance.get(
        `entries-update/${mostRecentEntry.id}`,
      );
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

export const fetchCategories = createAsyncThunk(
  "journal/fetchCategories",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const mostRecentEntry = await dispatch(fetchMostRecentEntry()).unwrap();
      const response = await instance.get(
        `categories-view/${mostRecentEntry.id}/`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("Unauthorized. Failed to fetch categories.");
      }
      return rejectWithValue("Failed to fetch categories.");
    }
  },
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

export const fetchMostRecentEntry = createAsyncThunk(
  "journal/fetchMostRecentEntry",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    setAuthToken(token);
    try {
      const response = await instance.get("most-recent-entry/");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue(
          "Unauthorized. Failed to fetch most recent entry.",
        );
      }
      return rejectWithValue("Failed to fetch most recent entry.");
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
          if (!state.journalEntries) {
            state.journalEntries = [];
          }
          state.journalEntries.push(action.payload);
        },
      )
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (state.error === "Unauthorized. Error Creating Entries.") {
          logout();
        }
      })
      .addCase(fetchMostRecentEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchMostRecentEntry.fulfilled,
        (state, action: PayloadAction<JournalEntry>) => {
          state.status = "succeeded";
          state.mostRecentEntry = action.payload;
        },
      )
      .addCase(fetchMostRecentEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        if (
          state.error === "Unauthorized. Failed to fetch most recent entry."
        ) {
          logout();
        }
      });
  },
});

export const { addCategory } = journalEntriesSlice.actions;

export const selectCategories = (state: RootState) => state.entries.categories;

export default journalEntriesSlice.reducer;
