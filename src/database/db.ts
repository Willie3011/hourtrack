import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  if(!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('hourtrack.db');
      await db.execAsync('PRAGMA journal_mode = WAL');
      await db.execAsync('PRAGMA foreign_keys = ON');
      return db;
    })().catch((error) => {
      dbPromise = null;
      throw error;
    })
  }

  return dbPromise;
}