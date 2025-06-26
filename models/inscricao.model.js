module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Inscricao', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        data_inscricao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        data_cancelamento: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'inscricoes',
        timestamps: false
    });
};