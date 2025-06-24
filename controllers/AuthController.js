const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Operações de autenticação de usuários
 */

module.exports = {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Realiza o login de um usuário
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
   *                 example: usuario@exemplo.com
   *               senha:
   *                 type: string
   *                 example: senha123
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: token=abcde12345; Path=/; HttpOnly
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *                   example: Login realizado com sucesso
   *       400:
   *         description: Credenciais inválidas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *                   example: Credenciais inválidas
   *       500:
   *         description: Erro interno do servidor
   */
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;
      
      if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
      }
      
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'nome', 'email', 'senha']
      });
      
      if (!user) {
        return res.status(400).json({ mensagem: "Credenciais inválidas" });
      }
      
      const validPassword = await bcrypt.compare(senha, user.senha);
      if (!validPassword) {
        return res.status(400).json({ mensagem: "Credenciais inválidas" });
      }
      
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'Lax'
      });
      
      return res.status(200).json({ 
        mensagem: "Login realizado com sucesso",
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ 
        mensagem: "Erro interno do servidor",
        erro: error.message
      });
    }
  }
};