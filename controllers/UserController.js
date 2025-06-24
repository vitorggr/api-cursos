const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações de gerenciamento de usuários
 */

module.exports = {
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
   *                 minLength: 3
   *                 maxLength: 100
   *               email:
   *                 type: string
   *                 format: email
   *                 example: joao@exemplo.com
   *               senha:
   *                 type: string
   *                 example: senha123
   *                 minLength: 6
   *               nascimento:
   *                 type: string
   *                 format: date
   *                 example: "1990-01-01"
   *                 description: Data de nascimento no formato YYYY-MM-DD
   *     responses:
   *       200:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 nome:
   *                   type: string
   *                 email:
   *                   type: string
   *                 nascimento:
   *                   type: string
   *                   format: date
   *       400:
   *         description: Erro na requisição
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *                 erros:
   *                   type: array
   *                   items:
   *                     type: string
   *       500:
   *         description: Erro interno do servidor
   */
  criarUsuario: async (req, res) => {
    try {
      const { nome, email, senha, nascimento } = req.body;
      
      // Validação dos campos
      const erros = [];
      if (!nome || nome.length < 3) erros.push("Nome deve ter pelo menos 3 caracteres");
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) erros.push("Email inválido");
      if (!senha || senha.length < 6) erros.push("Senha deve ter pelo menos 6 caracteres");
      if (!nascimento || !Date.parse(nascimento)) erros.push("Data de nascimento inválida");
      
      if (erros.length > 0) {
        return res.status(400).json({ 
          mensagem: "Erro de validação", 
          erros 
        });
      }
      
      // Verificar se email já existe
      const usuarioExistente = await User.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ mensagem: "Email já cadastrado" });
      }
      
      // Criptografar senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);
      
      // Criar usuário
      const novoUsuario = await User.create({
        nome,
        email,
        senha: hashedPassword,
        nascimento: new Date(nascimento)
      });
      
      // Formatar resposta (remover senha)
      const usuarioResponse = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        nascimento: novoUsuario.nascimento
      };
      
      return res.status(200).json(usuarioResponse);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ 
        mensagem: "Erro interno do servidor",
        erro: error.message
      });
    }
  }
};