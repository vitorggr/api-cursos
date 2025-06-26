// src/routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:idUsuario', authMiddleware.verificarToken, UsuarioController.cursosInscritos);

module.exports = router;