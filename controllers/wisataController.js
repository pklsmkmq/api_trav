const db = require('../config/db');

exports.getAllWisata = (req, res) => {
    db.all('SELECT * FROM wisata', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.getWisataById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM wisata WHERE idwisata = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
};

exports.createWisata = (req, res) => {
    const { namawisata, gambarwisata, hargaWisata, ratingWisata, deskripsi, isFav, Gallery, idCategory } = req.body;

    // Validation
    if (!namawisata || !gambarwisata || !hargaWisata || !ratingWisata || !deskripsi || isFav === undefined || !Gallery || !idCategory) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO wisata (namawisata, gambarwisata, hargaWisata, ratingWisata, deskripsi, isFav, Gallery, idCategory) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [namawisata, gambarwisata, hargaWisata, ratingWisata, deskripsi, isFav, Gallery, idCategory];
    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Wisata successfully created', id: this.lastID });
    });
};

exports.updateWisata = (req, res) => {
    const { id } = req.params;
    const { namawisata, gambarwisata, hargaWisata, ratingWisata, deskripsi, isFav, Gallery, idCategory } = req.body;
    const query = `UPDATE wisata SET namawisata = ?, gambarwisata = ?, hargaWisata = ?, ratingWisata = ?, deskripsi = ?, isFav = ?, Gallery = ?, idCategory = ?, updateAt = CURRENT_TIMESTAMP WHERE idwisata = ?`;
    const params = [namawisata, gambarwisata, hargaWisata, ratingWisata, deskripsi, isFav, Gallery, idCategory, id];
    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};

exports.deleteWisata = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM wisata WHERE idwisata = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
    });
};

exports.getAll = (req, res) => {
    console.log("jalan");

    db.all('SELECT * FROM wisata', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log("jalan 2");

        db.all('SELECT * FROM categories', [], (err, dt) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving categories', error: err.message });
            }
            console.log("jalan 3");

            return res.status(201).json({
                message: 'Success retrieving home data',
                wisata: rows,
                categories: dt
            });
        });
    });
};