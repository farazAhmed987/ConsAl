const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');
let database = null;

function save() {
  try {
    if (database) {
      const data = database.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
    }
  } catch (e) {
    console.error('Database save failed:', e.message);
  }
}

function hasColumn(table, column) {
  try {
    const info = database.exec(`PRAGMA table_info(${table})`);
    if (info.length === 0) return false;
    const colIndex = info[0].columns.indexOf('name');
    return info[0].values.some(row => row[colIndex] === column);
  } catch { return false }
}

const db = {
  get(sql, ...params) {
    const stmt = database.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const result = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();
    return result;
  },
  all(sql, ...params) {
    const stmt = database.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const results = [];
    while (stmt.step()) results.push(stmt.getAsObject());
    stmt.free();
    return results;
  },
  run(sql, ...params) {
    database.run(sql, params);
    const rowid = database.exec("SELECT last_insert_rowid()");
    const lastInsertRowid = rowid.length > 0 ? rowid[0].values[0][0] : 0;
    const changes = database.getRowsModified();
    save();
    return { changes, lastInsertRowid };
  },
  exec(sql) { return database.exec(sql); }
};

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, phone TEXT, role TEXT DEFAULT 'user' CHECK(role IN ('user','admin')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS animal_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), animal_type TEXT NOT NULL, location TEXT NOT NULL, lat REAL, lng REAL, description TEXT NOT NULL, photo_url TEXT, contact_name TEXT, contact_phone TEXT, admin_notes TEXT, status TEXT DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS doctors (id INTEGER PRIMARY KEY AUTOINCREMENT, submitted_by INTEGER REFERENCES users(id), name TEXT NOT NULL, clinic_name TEXT NOT NULL, specialty TEXT, city TEXT NOT NULL, contact TEXT NOT NULL, lat REAL, lng REAL, is_approved INTEGER DEFAULT 0 CHECK(is_approved IN (0,1,2)), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS cruelty_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), location TEXT NOT NULL, lat REAL, lng REAL, incident_description TEXT NOT NULL, severity TEXT DEFAULT 'medium' CHECK(severity IN ('low','medium','high','critical')), admin_notes TEXT, status TEXT DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS donations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), donor_name TEXT NOT NULL, donor_email TEXT, amount REAL NOT NULL, payment_method TEXT DEFAULT 'credit_card', transaction_id TEXT UNIQUE, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS adoption_applications (id INTEGER PRIMARY KEY AUTOINCREMENT, cruelty_report_id INTEGER NOT NULL REFERENCES cruelty_reports(id), user_id INTEGER NOT NULL REFERENCES users(id), applicant_name TEXT NOT NULL, applicant_contact TEXT NOT NULL, applicant_address TEXT NOT NULL, reason TEXT, status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS awareness_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, link_url TEXT, created_by INTEGER REFERENCES users(id), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, author TEXT, link_url TEXT, created_by INTEGER REFERENCES users(id), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
`;

const REQUIRED_COLUMNS = {
  animal_reports: ['admin_notes', 'updated_at'],
  cruelty_reports: ['admin_notes', 'updated_at'],
  awareness_posts: ['link_url'],
  blog_posts: ['link_url'],
};

function migrateSchema() {
  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
    for (const col of columns) {
      if (!hasColumn(table, col)) {
        console.log(`Migrating: adding ${col} to ${table}`);
        try {
          const defaultVal = col === 'updated_at' ? ' DEFAULT CURRENT_TIMESTAMP' : '';
          db.run(`ALTER TABLE ${table} ADD COLUMN ${col} TEXT${defaultVal}`);
        } catch (e) {
          console.error(`Migration failed for ${table}.${col}:`, e.message);
          // If ALTER TABLE fails (e.g. sql.js limitation), drop and recreate the table
          if (col === 'updated_at') {
            console.log(`Recreating ${table} table to add ${col} column`);
            const oldRows = db.all(`SELECT * FROM ${table}`);
            const tableDef = SCHEMA_SQL.match(new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\s*\\([^)]+\\)`));
            if (tableDef) {
              db.run(`DROP TABLE IF EXISTS ${table}`);
              db.run(tableDef[0]);
              // Re-insert data (columns might have shifted, be careful)
              if (oldRows.length > 0) {
                const cols = db.all(`PRAGMA table_info(${table})`).map(c => c.name);
                const placeholders = cols.map(() => '?').join(',');
                for (const row of oldRows) {
                  const values = cols.map(c => row[c] !== undefined ? row[c] : null);
                  db.run(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders})`, ...values);
                }
              }
            }
          }
        }
      }
    }
  }
}

async function initialize() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    database = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    database = new SQL.Database();
  }
  database.run("PRAGMA foreign_keys = ON");

  try { db.run('DROP TABLE IF EXISTS rescue_updates') } catch (e) {}

  db.exec(SCHEMA_SQL);

  migrateSchema();

  save();

  const existingAdmin = db.get('SELECT id FROM users WHERE role = ?', 'admin');
  if (!existingAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 'Admin', 'admin@pawpal.com', hash, 'admin');
    console.log('Seed admin created: admin@pawpal.com / admin123');
  }
}

module.exports = { db, initialize };
