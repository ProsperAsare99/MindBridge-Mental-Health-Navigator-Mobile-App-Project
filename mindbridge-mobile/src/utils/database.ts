import * as SQLite from 'expo-sqlite';

// Initialize Database connection
let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('mindbridge.db');
    
    // Create tables if they don't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id TEXT PRIMARY KEY,
        score INTEGER,
        emotions TEXT,
        note TEXT,
        created_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        mood TEXT,
        created_at TEXT,
        is_synced INTEGER DEFAULT 0
      );
    `);
    
    console.log('Local SQLite Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SQLite database', error);
  }
};

export const getDb = () => db;

// Helper function to insert a mood log
export const insertMoodLog = async (id: string, score: number, emotions: string[], note: string) => {
  if (!db) return;
  try {
    await db.runAsync(
      'INSERT INTO mood_logs (id, score, emotions, note, created_at, is_synced) VALUES (?, ?, ?, ?, ?, 0)',
      [id, score, JSON.stringify(emotions), note, new Date().toISOString()]
    );
  } catch (error) {
    console.error('Failed to insert mood log', error);
  }
};

// Helper function to get unsynced mood logs
export const getUnsyncedMoodLogs = async () => {
  if (!db) return [];
  try {
    const result = await db.getAllAsync('SELECT * FROM mood_logs WHERE is_synced = 0');
    return result;
  } catch (error) {
    console.error('Failed to get unsynced mood logs', error);
    return [];
  }
};

// Helper function to mark mood logs as synced
export const markMoodLogsAsSynced = async (ids: string[]) => {
  if (!db || ids.length === 0) return;
  try {
    const placeholders = ids.map(() => '?').join(',');
    await db.runAsync(`UPDATE mood_logs SET is_synced = 1 WHERE id IN (${placeholders})`, ids);
  } catch (error) {
    console.error('Failed to mark mood logs as synced', error);
  }
};
