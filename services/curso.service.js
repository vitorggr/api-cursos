const { Curso, Inscricao, sequelize } = require('../models');
const { Op } = require('sequelize');

class CursoService {
    // Lista cursos, com filtro opcional e informações de inscrição do usuário
    static async listar(usuarioId = null, filtro = null) {
        const whereClause = filtro ? {
            [Op.or]: [
                { nome: { [Op.like]: `%${filtro}%` } },
                { descricao: { [Op.like]: `%${filtro}%` } }
            ]
        } : {};

        // Busca cursos e conta inscrições ativas
        const cursos = await Curso.findAll({
            where: whereClause,
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.id_curso = Curso.id AND inscricoes.data_cancelamento IS NULL)'), 'inscricoes_ativas'],
                    ...(usuarioId !== null ? [
                        [sequelize.literal(`EXISTS(SELECT 1 FROM inscricoes WHERE inscricoes.id_curso = Curso.id AND inscricoes.id_usuario = ${usuarioId} AND inscricoes.data_cancelamento IS NULL)`), 'usuario_inscrito']
                    ] : [])
                ]
            },
            order: [['inicio', 'ASC']]
        });

        return cursos.map(curso => ({
            id: curso.id,
            nome: curso.nome,
            descricao: curso.descricao,
            capa: curso.capa,
            inscricoes: Number(curso.getDataValue('inscricoes_ativas')),
            inicio: curso.inicio ? new Date(curso.inicio).toLocaleDateString('pt-BR') : null,
            inscrito: usuarioId !== null ? Boolean(curso.getDataValue('usuario_inscrito')) : undefined
        }));
    }

    // Lista apenas cursos em que o usuário está inscrito
    static async listarInscritos(usuarioId) {
        const cursos = await Curso.findAll({
            include: [{
                model: Inscricao,
                where: {
                    id_usuario: usuarioId,
                    data_cancelamento: null
                },
                required: true
            }],
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.id_curso = Curso.id AND inscricoes.data_cancelamento IS NULL)'), 'inscricoes_ativas']
                ]
            },
            order: [['inicio', 'ASC']]
        });

        return cursos.map(curso => ({
            id: curso.id,
            nome: curso.nome,
            descricao: curso.descricao,
            capa: curso.capa,
            inscricoes: Number(curso.getDataValue('inscricoes_ativas')),
            inicio: curso.inicio ? new Date(curso.inicio).toLocaleDateString('pt-BR') : null,
            inscrito: true
        }));
    }

    static async buscarPorId(id) {
        return await Curso.findByPk(id);
    }
}

module.exports = CursoService;