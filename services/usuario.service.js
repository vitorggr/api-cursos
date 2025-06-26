const { Usuario, Inscricao, Curso } = require('../models');

class UsuarioService {
    static async buscarPorId(id) {
        return await Usuario.findByPk(id);
    }

    static async cursosInscritos(idUsuario) {
        const inscricoes = await Inscricao.findAll({
            where: { id_usuario: idUsuario },
            include: [{
                model: Curso,
                attributes: ['id', 'nome', 'descricao', 'capa', 'inicio']
            }]
        });

        return inscricoes.map(inscricao => {
            const curso = inscricao.Curso;
            return {
                ...curso.toJSON(),
                inscricao_cancelada: !!inscricao.data_cancelamento,
                inscrito: true
            };
        });
    }
}

module.exports = UsuarioService;