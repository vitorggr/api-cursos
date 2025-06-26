module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Curso', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        capa: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'cursos',
        timestamps: false
    });
};