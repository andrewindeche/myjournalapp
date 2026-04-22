import * as SQLite from 'expo-sqlite';
import { JournalEntry, Category } from '../types';

const DB_NAME = 'journal.db';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<void> => {
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

export const saveJournalEntryLocally = async (
  entry: Omit<JournalEntry, 'created_at'>,
  isNew: boolean = false
): Promise<void> => {
  if (!db) await initDatabase();
  
  const now = new Date().toISOString();
  const existing = await db!.getAllAsync<{id: number}>(
    'SELECT id FROM journal_entries WHERE id = ?', 
    [entry.id]
  );

  if (existing.length > 0) {
    await db!.runAsync(
      `UPDATE journal_entries 
       SET title = ?, content_text = ?, content_image = ?, category = ?, 
           is_synced = 0, is_updated = 1 
       WHERE id = ?`,
      [entry.title, entry.content_text, entry.content_image, 
       entry.category, entry.id]
    );
    
    await addPendingSync('update', entry.id, entry);
  } else {
    await db!.runAsync(
      `INSERT INTO journal_entries (id, title, content_text, content_image, created_at, category, is_synced)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [entry.id, entry.title, entry.content_text, entry.content_image,
       now, entry.category]
    );
    
    await addPendingSync('create', entry.id, entry);
  }
};

export const getLocalJournalEntries = async (): Promise<JournalEntry[]> => {
  if (!db) await initDatabase();
  
  const entries = await db!.getAllAsync<JournalEntry & {is_deleted: number}>(
    'SELECT * FROM journal_entries WHERE is_deleted = 0 ORDER BY created_at DESC'
  );
  
  return entries.map(e => ({
    ...e,
    content: e.content_text ? [{ type: 'text' as const, value: e.content_text }] : [],
    content_image: e.content_image
  }));
};

export const deleteJournalEntryLocally = async (entryId: number): Promise<void> => {
  if (!db) await initDatabase();
  
  await db!.runAsync(
    'UPDATE journal_entries SET is_synced = 0, is_deleted = 1 WHERE id = ?',
    [entryId]
  );
  
  await addPendingSync('delete', entryId, null);
};

export const saveCategoriesLocally = async (categories: Category[]): Promise<void> => {
  if (!db) await initDatabase();
  
  await db!.runAsync('DELETE FROM categories');
  
  for (const cat of categories) {
    await db!.runAsync(
      'INSERT OR REPLACE INTO categories (id, name, is_synced) VALUES (?, ?, 1)',
      [cat.id, cat.name]
    );
  }
};

export const getLocalCategories = async (): Promise<Category[]> => {
  if (!db) await initDatabase();
  
  return await db!.getAllAsync<Category>(
    'SELECT * FROM categories ORDER BY name'
  );
};

const addPendingSync = async (
  operation: string,
  entryId: number,
  data: unknown
): Promise<void> => {
  if (!db) await initDatabase();
  
  const now = new Date().toISOString();
  await db!.runAsync(
    'INSERT INTO pending_sync (operation, entry_id, data, timestamp) VALUES (?, ?, ?, ?)',
    [operation, entryId, JSON.stringify(data), now]
  );
};

export const getPendingSyncItems = async (): Promise<
  Array<{ id: number; operation: string; entry_id: number; data: string; timestamp: string }>
> => {
  if (!db) await initDatabase();
  
  return await db!.getAllAsync(
    'SELECT * FROM pending_sync ORDER BY timestamp'
  );
};

export const clearPendingSyncItem = async (syncId: number): Promise<void> => {
  if (!db) await initDatabase();
  
  await db!.runAsync('DELETE FROM pending_sync WHERE id = ?', [syncId]);
};

export const markEntriesSynced = async (entryIds: number[]): Promise<void> => {
  if (!db) await initDatabase();
  
  const placeholders = entryIds.map(() => '?').join(',');
  await db!.runAsync(
    `UPDATE journal_entries SET is_synced = 1, is_updated = 0 WHERE id IN (${placeholders})`,
    entryIds
  );
};

export const hasUnsyncedChanges = async (): Promise<boolean> => {
  if (!db) await initDatabase();
  
  const result = await db!.getFirstAsync<{count: number}>(
    'SELECT COUNT(*) as count FROM pending_sync'
  );
  
  return (result?.count ?? 0) > 0;
};

export const getUnsyncedEntries = async (): Promise<JournalEntry[]> => {
  if (!db) await initDatabase();
  
  const entries = await db!.getAllAsync<JournalEntry & {is_deleted: number}>(
    'SELECT * FROM journal_entries WHERE is_synced = 0'
  );
  
  return entries.map(e => ({
    ...e,
    content: e.content_text ? [{ type: 'text' as const, value: e.content_text }] : [],
    content_image: e.content_image
  }));
};