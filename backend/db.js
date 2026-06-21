const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');
let database = null;

function save() {
  if (database) {
    const data = database.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
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

async function initialize() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    database = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    database = new SQL.Database();
  }
  database.run("PRAGMA foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, phone TEXT, role TEXT DEFAULT 'user' CHECK(role IN ('user','admin')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS animal_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), animal_type TEXT NOT NULL, location TEXT NOT NULL, lat REAL, lng REAL, description TEXT NOT NULL, photo_url TEXT, contact_name TEXT, contact_phone TEXT, status TEXT DEFAULT 'pending' CHECK(status IN ('pending','in_progress','resolved')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS doctors (id INTEGER PRIMARY KEY AUTOINCREMENT, submitted_by INTEGER REFERENCES users(id), name TEXT NOT NULL, clinic_name TEXT NOT NULL, specialty TEXT, city TEXT NOT NULL, contact TEXT NOT NULL, lat REAL, lng REAL, is_approved INTEGER DEFAULT 0 CHECK(is_approved IN (0,1,2)), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS cruelty_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), location TEXT NOT NULL, lat REAL, lng REAL, incident_description TEXT NOT NULL, severity TEXT DEFAULT 'medium' CHECK(severity IN ('low','medium','high','critical')), status TEXT DEFAULT 'pending' CHECK(status IN ('pending','investigating','resolved')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS donations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), donor_name TEXT NOT NULL, donor_email TEXT, amount REAL NOT NULL, payment_method TEXT DEFAULT 'credit_card', transaction_id TEXT UNIQUE, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS rescue_updates (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, location TEXT NOT NULL, description TEXT, status TEXT NOT NULL, image_url TEXT, created_by INTEGER REFERENCES users(id), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS awareness_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, link_url TEXT, created_by INTEGER REFERENCES users(id), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, author TEXT, created_by INTEGER REFERENCES users(id), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  `);
  save();

  const existingAdmin = db.get('SELECT id FROM users WHERE role = ?', 'admin');
  if (!existingAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 'Admin', 'admin@pawpal.com', hash, 'admin');
    console.log('Seed admin created: admin@pawpal.com / admin123');
  }
}

module.exports = { db, initialize };