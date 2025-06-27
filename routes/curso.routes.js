const express = require('express');
const router = express.Router();
const CursoController = require('../controllers/curso.controller');
const InscricaoController = require('../controllers/inscricao.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/cursos/', CursoController.listar);
router.get('/:idUsuario', CursoController.listarInscritos);
router.post('/cursos/:idCurso', authMiddleware.verificarToken, async (req, res, next) => {
  try {
    // Permite reinscrição: se houver inscrição cancelada, reativa (data_cancelamento = null)
    const { Inscricao } = require('../models');
    const inscricao = await Inscricao.findOne({
      where: {
        id_usuario: req.usuarioId,
        id_curso: req.params.idCurso
      }
    });
    if (inscricao && inscricao.data_cancelamento) {
      inscricao.data_cancelamento = null;
      await inscricao.save({ fields: ['data_cancelamento'] });
      return res.status(200).json({ mensagem: 'Inscrição reativada com sucesso.' });
    }
    if (inscricao && !inscricao.data_cancelamento) {
      // Já está inscrito
      return res.status(400).json({ mensagem: 'Você já está inscrito neste curso.' });
    }
    await InscricaoController.inscrever(req, res);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /cursos/{idCurso}:
 *   patch:
 *     summary: Cancela a inscrição do usuário em um curso
 *     tags: [Cursos]
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
 *         description: Inscrição cancelada com sucesso
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
router.patch('/cursos/:idCurso', authMiddleware.verificarToken, InscricaoController.cancelar);

module.exports = router;