// src/services/curso.service.js
const { Curso, Inscricao, sequelize } = require('../models');

class CursoService {
    static async listar() {
        return await Curso.findAll({
            attributes: [
                'id',
                'nome',
                'descricao',
                'capa',
                'inicio',
                [sequelize.fn('COUNT', sequelize.col('Inscricoes.id')), 'inscricoes']
            ],
            include: [{
                model: Inscricao,
                attributes: [],
                where: { data_cancelamento: null },
                required: false
            }],
            group: ['Curso.id']
        });
    }

    static async buscarPorId(id) {
        return await Curso.findByPk(id);
    }
}

module.exports = CursoService;