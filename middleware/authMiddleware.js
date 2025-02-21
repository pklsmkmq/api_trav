const jwt = require('jsonwebtoken');

// Middleware untuk mengecek token JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak, token tidak tersedia' });
    }
    
    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified; // Menyimpan data pengguna ke dalam request
        next(); // Lanjut ke route berikutnya
    } catch (err) {
        res.status(400).json({ message: 'Token tidak valid' });
    }
};

module.exports = authMiddleware;
