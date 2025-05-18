import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../data/urlshortener.db');

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('Connected to SQLite database');
                this.initDatabase();
            }
        });
    }

    initDatabase() {
        const createTablesSQL = `
            CREATE TABLE IF NOT EXISTS urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_url TEXT NOT NULL,
                short_key TEXT UNIQUE NOT NULL,
                username TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_accessed DATETIME,
                access_count INTEGER DEFAULT 0
            );
        `;

        this.db.exec(createTablesSQL, (err) => {
            if (err) {
                console.error('Error creating tables:', err);
            } else {
                console.log('Database tables created successfully');
            }
        });
    }

    async createShortUrl(originalUrl, shortKey, username = null) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO urls (original_url, short_key, username) VALUES (?, ?, ?)';
            this.db.run(sql, [originalUrl, shortKey, username], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    async getOriginalUrl(shortKey) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE urls 
                SET access_count = access_count + 1,
                    last_accessed = CURRENT_TIMESTAMP
                WHERE short_key = ?
                RETURNING original_url`;
            this.db.get(sql, [shortKey], (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.original_url : null);
            });
        });
    }

    async getUserUrls(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM urls WHERE username = ?';
            this.db.all(sql, [username], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async checkShortKeyAvailable(shortKey) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM urls WHERE short_key = ?';
            this.db.get(sql, [shortKey], (err, row) => {
                if (err) reject(err);
                else resolve(row.count === 0);
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

export const db = new Database(); 