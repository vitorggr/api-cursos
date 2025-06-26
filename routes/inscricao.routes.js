// src/routes/inscricao.routes.js
const express = require('express');
const router = express.Router();
const InscricaoController = require('../controllers/inscricao.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/:idCurso', authMiddleware.verificarToken, InscricaoController.inscrever);
router.delete('/:idCurso', authMiddleware.verificarToken, InscricaoController.cancelar);

module.exports = router;