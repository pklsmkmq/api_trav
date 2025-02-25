const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        isVerif INTEGER DEFAULT 0,
        verificationCode TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS wisata (
        idwisata INTEGER PRIMARY KEY AUTOINCREMENT,
        namawisata VARCHAR(255) NOT NULL,
        gambarwisata VARCHAR(255),
        hargaWisata INTEGER,
        lokasiWisata VARCHAR(255),
        ratingWisata FLOAT,
        
        deskripsi TEXT,
        isFav BOOLEAN,
        Gallery TEXT,
        idCategory INTEGER,
        createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updateAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idCategory) REFERENCES category(id)
      )`);
});

module.exports = db;
