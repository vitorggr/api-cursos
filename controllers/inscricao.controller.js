const InscricaoService = require('../services/inscricao.service');

/**
 * @swagger
 * /inscricoes:
 *   get:
 *     summary: Lista todas as inscrições
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Cria uma nova inscrição
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               cursoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
class InscricaoController {
    static async inscrever(req, res) {
        try {
            const { idCurso } = req.params;
            await InscricaoService.inscrever(req.usuarioId, idCurso);
            res.status(200).json({ mensagem: 'Inscrição realizada' });
        } catch (error) {
            const status = error.message.includes('não encontrado') ? 404 : 400;
            res.status(status).json({ mensagem: error.message });
        }
    }

    static async cancelar(req, res) {
        try {
            const { idCurso } = req.params;
            await InscricaoService.cancelar(req.usuarioId, idCurso);
            res.status(200).json({ mensagem: 'Inscrição cancelada' });
        } catch (error) {
            const status = error.message.includes('não encontrada') ? 404 : 400;
            res.status(status).json({ mensagem: error.message });
        }
    }
}

module.exports = InscricaoController;