import Database from 'better-sqlite3';
import path from 'path';
import { logger } from '../config/logger';

const dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'database.db');

let db: Database.Database;

const connectDB = (): void => {
  try {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('SQLite database connected');
  } catch (error) {
    logger.error({ err: error }, 'SQLite connection error');
    process.exit(1);
  }

  process.on('SIGINT', () => {
    if (db) {
      db.close();
      logger.info('SQLite connection closed');
    }
    process.exit(0);
  });
};

const getDB = (): Database.Database => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

export { connectDB, getDB };
export default db;
