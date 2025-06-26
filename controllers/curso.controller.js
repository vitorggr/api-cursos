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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
 */
class CursoController {
    static async listar(req, res) {
        try {
            const cursos = await CursoService.listar();
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    }
}

module.exports = CursoController;