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
    /**
     * Lista todos os cursos, com suporte a filtro e indicação de inscrição do usuário (se informado)
     */
    static async listar(req, res) {
        try {
            // Permite filtrar cursos por nome/descrição e indicar se o usuário está inscrito
            const filtro = req.query.filtro || null;
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : null;
            const cursos = await CursoService.listar(usuarioId, filtro);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    }

    /**
     * Lista os cursos em que o usuário está inscrito
     */
    static async listarInscritos(req, res) {
        try {
            // Garante que o idUsuario é um número válido, senão retorna array vazio
            const usuarioId = Number(req.params.idUsuario);
            if (isNaN(usuarioId)) {
                return res.status(200).json([]);
            }
            const cursos = await CursoService.listarInscritos(usuarioId);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    }
}

module.exports = CursoController;