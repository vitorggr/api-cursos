const { Inscricao, Curso } = require('../models');

class InscricaoService {
    static async inscrever(idUsuario, idCurso) {
        const curso = await Curso.findByPk(idCurso);
        if (!curso) {
            throw new Error('Curso não encontrado');
        }

        // Verificar se o curso já começou
        const hoje = new Date();
        if (curso.inicio < hoje) {
            throw new Error('Curso já iniciado');
        }

        // Verificar se já existe inscrição ativa
        const inscricaoExistente = await Inscricao.findOne({
            where: {
                id_usuario: idUsuario,
                id_curso: idCurso,
                data_cancelamento: null
            }
        });

        if (inscricaoExistente) {
            throw new Error('Já inscrito neste curso');
        }

        return await Inscricao.create({
            id_usuario: idUsuario,
            id_curso: idCurso
        });
    }

    static async cancelar(idUsuario, idCurso) {
        const inscricao = await Inscricao.findOne({
            where: {
                id_usuario: idUsuario,
                id_curso: idCurso,
                data_cancelamento: null
            }
        });

        if (!inscricao) {
            throw new Error('Inscrição não encontrada ou já cancelada');
        }

        const curso = await Curso.findByPk(idCurso);
        const hoje = new Date();
        if (curso.inicio < hoje) {
            throw new Error('Curso já iniciado');
        }

        inscricao.data_cancelamento = new Date();
        await inscricao.save();
        return inscricao;
    }
}

module.exports = InscricaoService;