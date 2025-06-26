const CursoService = require('../services/curso.service');

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Lista todos os cursos disponíveis
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               capa:
 *                 type: string
 *               inicio:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *
 * /{idUsuario}:
 *   get:
 *     summary: Lista os cursos em que o usuário está inscrito
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Erro ao listar cursos inscritos
 *     security:
 *       - bearerAuth: []
 */
class CursoController {
    static async listar(req, res) {
        try {
            // Captura filtro e usuarioId dos query params
            const filtro = req.query.filtro || null;
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : null;
            const cursos = await CursoService.listar(usuarioId, filtro);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    }

    static async listarInscritos(req, res) {
        try {
            const usuarioId = Number(req.params.idUsuario);
            if (!usuarioId) {
                return res.status(400).json({ mensagem: 'ID do usuário é obrigatório' });
            }
            const cursos = await CursoService.listarInscritos(usuarioId);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    }
}

module.exports = CursoController;