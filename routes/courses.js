const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');
const courseController = require('../controllers/CourseController');

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *
 * /cursos/{idCurso}:
 *   post:
 *     summary: Inscreve o usuário autenticado em um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscrição realizada
 *       400:
 *         description: Erro na inscrição
 *   delete:
 *     summary: Cancela a inscrição do usuário autenticado em um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscrição cancelada
 *       400:
 *         description: Erro ao cancelar inscrição
 *
 * /{idUsuario}:
 *   get:
 *     summary: Lista cursos inscritos de um usuário
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de cursos inscritos
 */

// GET /cursos (listar cursos - público)
router.get('/', courseController.listarCursos);
// POST /cursos/:idCurso (inscrever - protegido)
router.post('/:idCurso', authMiddleware, courseController.inscreverCurso);
// DELETE /cursos/:idCurso (cancelar inscrição - protegido)
router.delete('/:idCurso', authMiddleware, courseController.cancelarInscricao);
// GET /:idUsuario (listar cursos inscritos - protegido)
router.get('/:idUsuario', authMiddleware, courseController.listarCursosInscritos);

module.exports = router;