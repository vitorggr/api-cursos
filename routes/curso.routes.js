const express = require('express');
const router = express.Router();
const CursoController = require('../controllers/curso.controller');
const InscricaoController = require('../controllers/inscricao.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/cursos/', CursoController.listar);
router.get('/:idUsuario', CursoController.listarInscritos);
router.post('/cursos/:idCurso', authMiddleware.verificarToken, InscricaoController.inscrever);
router.patch('/cursos/:idCurso', authMiddleware.verificarToken, InscricaoController.cancelar);

module.exports = router;