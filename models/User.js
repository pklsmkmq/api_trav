const db = require('../config/db');

class User {
    static create({ name, email, password, verificationCode }, callback) {
        const query = `INSERT INTO user (name, email, password, verificationCode) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, email, password, verificationCode], function (err) {
            callback(err, this?.lastID);
        });
    }

    static findOne(kode, callback) {
        db.get('SELECT * FROM user WHERE verificationCode = ?', [kode], (err, row) => callback(err, row));
    }

    static findByEmail(email, callback) {
        db.get(`SELECT * FROM user WHERE email = ?`, [email], (err, row) => callback(err, row));
    }

    static verifyEmail(email, callback) {
        db.run(`UPDATE user SET isVerif = 1, verificationCode = NULL WHERE email = ?`, [email], callback);
    }

    static updatePassword(email, newPassword, callback) {
        const query = `UPDATE user SET password = ? WHERE email = ?`;
        db.run(query, [newPassword, email], callback);
    }
}

module.exports = User;
