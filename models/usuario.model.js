module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        tableName: 'usuarios',
        timestamps: false
    });
};