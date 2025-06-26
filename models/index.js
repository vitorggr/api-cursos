const sequelize = require('../config/database');
const Usuario = require('./usuario.model')(sequelize, sequelize.Sequelize.DataTypes);
const Curso = require('./curso.model')(sequelize, sequelize.Sequelize.DataTypes);
const Inscricao = require('./inscricao.model')(sequelize, sequelize.Sequelize.DataTypes);

// Associações
Usuario.belongsToMany(Curso, {
    through: Inscricao,
    foreignKey: 'id_usuario',
    otherKey: 'id_curso'
});

Curso.belongsToMany(Usuario, {
    through: Inscricao,
    foreignKey: 'id_curso',
    otherKey: 'id_usuario'
});

Inscricao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Inscricao.belongsTo(Curso, { foreignKey: 'id_curso' });

module.exports = {
    sequelize,
    Usuario,
    Curso,
    Inscricao
};