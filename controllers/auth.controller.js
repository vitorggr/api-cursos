const AuthService = require('../services/auth.service');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados inválidos
 */
class AuthController {
    static async login(req, res) {
        try {
            const { email, senha } = req.body;
            const token = await AuthService.login(email, senha);
            res.status(200).json(token);
        } catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    }

    static async registrar(req, res) {
        try {
            const { nome, email, senha, nascimento } = req.body;
            await AuthService.registrar(nome, email, senha, nascimento);
            res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
        } catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    }
}

module.exports = AuthController;