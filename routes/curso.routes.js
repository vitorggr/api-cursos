// src/routes/curso.routes.js
const express = require('express');
const router = express.Router();
const CursoController = require('../controllers/curso.controller');

router.get('/', CursoController.listar);

module.exports = router;