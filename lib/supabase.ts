import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

class SQLiteStorage {
  private db: SQLite.SQLiteDatabase | null = null;

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('supabase-storage');
      await this.db.execAsync(
        'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT);'
      );
    }
    return this.db;
  }

  async getItem(key: string): Promise<string | null> {
    const db = await this.getDb();
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM kv WHERE key = ?;',
      [key]
    );
    return row?.value ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    const db = await this.getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?);',
      [key, value]
    );
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM kv WHERE key = ?;', [key]);
  }
}

const webStorage = {
  getItem(key: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? webStorage : new SQLiteStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
