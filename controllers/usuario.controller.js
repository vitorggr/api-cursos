const UsuarioService = require('../services/usuario.service');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * /usuarios/{idUsuario}/cursos:
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
 */
class UsuarioController {
    static async cursosInscritos(req, res) {
        try {
            const { idUsuario } = req.params;
            if (parseInt(idUsuario) !== req.usuarioId) {
                return res.status(403).json({ mensagem: 'Acesso não autorizado' });
            }

            const cursos = await UsuarioService.cursosInscritos(idUsuario);
            res.status(200).json(cursos);
        } catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    }

    /**
     * @swagger
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
    static async criarConta(req, res) {
        try {
            debugger;
            const { nome, email, senha, nascimento } = req.body;
            if (!nome || !email || !senha || !nascimento) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
            }
            // Validação simples de email e senha
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                return res.status(400).json({ mensagem: 'Email inválido' });
            }
            if (senha.length < 6) {
                return res.status(400).json({ mensagem: 'Senha deve ter pelo menos 6 caracteres' });
            }
            // Verifica se usuário já existe
            const existe = await require('../models').Usuario.findOne({ where: { email } });
            if (existe) {
                return res.status(400).json({ mensagem: 'Email já cadastrado' });
            }
            // Aceita nascimento em dd/mm/aaaa ou yyyy-mm-dd
            let nascimentoISO;
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) {
                const [dia, mes, ano] = nascimento.split('/');
                nascimentoISO = `${ano}-${mes}-${dia}`;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
                nascimentoISO = nascimento;
            } else {
                return res.status(400).json({ mensagem: 'Data de nascimento inválida. Use dd/mm/aaaa ou yyyy-mm-dd.' });
            }
            // Criptografa a senha
            const senhaHash = await bcrypt.hash(senha, 10);
            const novoUsuario = await require('../models').Usuario.create({
                nome,
                email,
                senha: senhaHash,
                nascimento: nascimentoISO
            });
            return res.status(200).json({ id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, nascimento: novoUsuario.nascimento });
        } catch (error) {
            return res.status(400).json({ mensagem: error.message });
        }
    }
}

module.exports = UsuarioController;