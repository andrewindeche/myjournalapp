import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import instance from '../redux/axiosInstance';
import {
  initDatabase,
  getLocalJournalEntries,
  saveJournalEntryLocally,
  deleteJournalEntryLocally,
  getPendingSyncItems,
  clearPendingSyncItem,
  markEntriesSynced,
  getUnsyncedEntries,
} from './offlineStorage';

const DB_NAME = 'journal.db';

let db: SQLite.SQLiteDatabase | null = null;

export const initSyncDatabase = async (): Promise<void> => {
  db = await SQLite.openDatabaseAsync(DB_NAME);
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      content_text TEXT,
      content_image TEXT,
      created_at TEXT NOT NULL,
      category TEXT NOT NULL,
      is_synced INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      is_updated INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      is_synced INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS pending_sync (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      entry_id INTEGER,
      data TEXT,
      timestamp TEXT NOT NULL
    );
  `);
};

const checkNetworkConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const syncWithBackend = async (authToken: string): Promise<{
  success: boolean;
  message: string;
}> => {
  const isConnected = await checkNetworkConnection();
  
  if (!isConnected) {
    return { success: false, message: 'No network connection' };
  }

  try {
    await initSyncDatabase();
    
    instance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    const pendingItems = await getPendingSyncItems();
    
    for (const item of pendingItems) {
      try {
        const entryData = item.data ? JSON.parse(item.data) : null;
        
        switch (item.operation) {
          case 'create':
            await syncCreateEntry(authToken, entryData);
            break;
          case 'update':
            await syncUpdateEntry(authToken, item.entry_id, entryData);
            break;
          case 'delete':
            await syncDeleteEntry(authToken, item.entry_id);
            break;
        }
        
        await clearPendingSyncItem(item.id);
      } catch (error) {
        console.error(`Sync failed for operation ${item.operation}:`, error);
      }
    }
    
    await fetchAndStoreRemoteEntries(authToken);
    
    return { success: true, message: 'Sync completed successfully' };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, message: 'Sync failed' };
  }
};

const syncCreateEntry = async (token: string, entry: unknown): Promise<void> => {
  const entryData = entry as {
    title: string;
    category: string;
    content_text?: string;
    content_image?: { uri: string; name: string };
  };
  
  const formData = new FormData();
  formData.append('title', entryData.title);
  formData.append('category', entryData.category);
  
  if (entryData.content_text) {
    formData.append('content_text', entryData.content_text);
  }
  
  if (entryData.content_image) {
    const { uri, name } = entryData.content_image;
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('content_image', blob, name);
  }
  
  await instance.post('entries-create/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
};

const syncUpdateEntry = async (token: string, entryId: number, entry: unknown): Promise<void> => {
  const entryData = entry as {
    title: string;
    category: string;
    content_text?: string;
    content_image?: { uri: string; name: string };
  };
  
  const formData = new FormData();
  formData.append('title', entryData.title);
  formData.append('category', entryData.category);
  
  if (entryData.content_text) {
    formData.append('content_text', entryData.content_text);
  }
  
  if (entryData.content_image) {
    const { uri, name } = entryData.content_image;
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('content_image', blob, name);
  }
  
  await instance.put(`entries-update/${entryId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  });
};

const syncDeleteEntry = async (token: string, entryId: number): Promise<void> => {
  await instance.delete(`entries-update/${entryId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const fetchAndStoreRemoteEntries = async (token: string): Promise<void> => {
  try {
    const response = await instance.get('entries-create/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const entries = response.data;
    
    if (db && entries && Array.isArray(entries)) {
      for (const entry of entries) {
        await db.runAsync(
          `INSERT OR REPLACE INTO journal_entries 
           (id, title, content_text, content_image, created_at, category, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [
            entry.id,
            entry.title,
            entry.content_text || null,
            entry.content_image?.uri || null,
            entry.created_at,
            entry.category,
          ]
        );
      }
    }
  } catch (error) {
    console.error('Failed to fetch remote entries:', error);
  }
};

export const saveEntryWithSync = async (
  entry: {
    title: string;
    category: string;
    content_text?: string;
    content_image?: { uri: string; name: string };
    id?: number;
  },
  authToken: string,
  isNew: boolean
): Promise<{ success: boolean; localId?: number }> => {
  const isConnected = await checkNetworkConnection();
  
  const localId = entry.id || Math.floor(Math.random() * 1000000);
  
  const entryWithId = { ...entry, id: localId };
  
  await saveJournalEntryLocally(entryWithId, isNew);
  
  if (isConnected) {
    const result = await syncWithBackend(authToken);
    if (!result.success) {
      console.warn('Sync failed, entry saved locally:', result.message);
    }
  }
  
  return { success: true, localId };
};

export const deleteEntryWithSync = async (
  entryId: number,
  authToken: string
): Promise<void> => {
  await deleteJournalEntryLocally(entryId);
  
  const isConnected = await checkNetworkConnection();
  
  if (isConnected) {
    await syncWithBackend(authToken);
  }
};

export const loadEntries = async (authToken: string): Promise<unknown[]> => {
  const isConnected = await checkNetworkConnection();
  
  if (isConnected) {
    try {
      await syncWithBackend(authToken);
    } catch (error) {
      console.warn('Sync failed, loading from local storage:', error);
    }
  }
  
  return await getLocalJournalEntries();
};