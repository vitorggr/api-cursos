const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /usuarios/{idUsuario}:
 *   get:
 *     summary: Lista os cursos em que o usuário está inscrito
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de cursos inscritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Acesso não autorizado
 *       500:
 *         description: Erro interno do servidor
 *
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - nascimento
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *               nascimento:
 *                 type: string
 *                 example: "2000-06-24"
 *                 description: Data de nascimento no formato yyyy-mm-dd
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */

router.get('/:idUsuario', authMiddleware.verificarToken, UsuarioController.cursosInscritos);
router.post('/', UsuarioController.criarConta);

module.exports = router;