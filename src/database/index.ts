import * as SQLite from 'expo-sqlite';

export const openDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('hourtrack.db');
    return db;
}