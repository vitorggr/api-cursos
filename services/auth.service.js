const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

class AuthService {
    static async login(email, senha) {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    static async registrar(nome, email, senha, nascimento) {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            throw new Error('Email já cadastrado');
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash,
            nascimento
        });

        return novoUsuario;
    }
}

module.exports = AuthService;