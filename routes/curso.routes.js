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
router.patch('/cursos/:idCurso', authMiddleware.verificarToken, InscricaoController.cancelar);

module.exports = router;