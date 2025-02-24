const express = require('express');
const router = express.Router();
const wisataController = require('../controllers/wisataController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, wisataController.getAllWisata);
router.get('/home', authMiddleware, wisataController.getAll);
router.get('/:id', authMiddleware, wisataController.getWisataById);
router.post('/', authMiddleware, wisataController.createWisata);
router.put('/:id', authMiddleware, wisataController.updateWisata);
router.delete('/:id', authMiddleware, wisataController.deleteWisata);

module.exports = router;