import Database from 'better-sqlite3';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const databaseDirectory = path.join(process.cwd(), 'data');
const databasePath = path.join(databaseDirectory, 'database.sqlite');
const schemaPath = path.join(process.cwd(), 'src/database/schema.sql');

mkdirSync(databaseDirectory, { recursive: true });

export const db = new Database(databasePath);

export function initDatabase(): void {
  const schema = readFileSync(schemaPath, 'utf-8');

  db.exec(schema);
}
