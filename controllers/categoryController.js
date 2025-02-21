const db = require('../config/db');

const createCategory = (req, res) => {
    console.log(req.body);
    const { name, image } = req.body;

    if (!name || !image) {
        return res.status(400).json({ message: 'All fields (name, image) are required' });
    }

    const query = `INSERT INTO categories (name, image) VALUES (?, ?)`;
    db.run(query, [name, image], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error creating category', error: err.message });
        }
        res.status(201).json({ message: 'Category created successfully', id: this.lastID });
    });
};

const getAllCategories = (req, res) => {
    const query = `SELECT * FROM categories`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving categories', error: err.message });
        }
        res.status(200).json(rows);
    });
};

const getCategoryById = (req, res) => {
    const query = `SELECT * FROM categories WHERE id = ?`;
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving category', error: err.message });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    });
};

const updateCategory = (req, res) => {
    const { name, image } = req.body;
    const query = `UPDATE categories SET name = ?, image = ? WHERE id = ?`;
    db.run(query, [name, image, req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating category', error: err.message });
        }
        if (this.changes > 0) {
            res.status(200).json({ message: 'Category updated successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    });
};

const deleteCategory = (req, res) => {
    const query = `DELETE FROM categories WHERE id = ?`;
    db.run(query, [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting category', error: err.message });
        }
        if (this.changes > 0) {
            res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    });
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};