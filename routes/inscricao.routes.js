const express = require('express');
const router = express.Router();
const InscricaoController = require('../controllers/inscricao.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /inscricoes/{idCurso}:
 *   post:
 *     summary: Inscreve o usuário autenticado em um curso
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Inscrição realizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Inscrição realizada
 *       400:
 *         description: Erro ao inscrever
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Você já está inscrito neste curso.
 *       403:
 *         description: Token inválido ou não fornecido
 *   delete:
 *     summary: Cancela a inscrição do usuário autenticado em um curso
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCurso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Inscrição cancelada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Inscrição cancelada
 *       400:
 *         description: Erro ao cancelar inscrição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Inscrição não encontrada ou já cancelada
 *       403:
 *         description: Token inválido ou não fornecido
 */

router.post('/:idCurso', authMiddleware.verificarToken, InscricaoController.inscrever);
router.delete('/:idCurso', authMiddleware.verificarToken, InscricaoController.cancelar);

module.exports = router;