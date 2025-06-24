const { DataTypes, Model } = require('sequelize');

class Course extends Model {}

function initCourse(sequelize) {
  Course.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    capa: {
      type: DataTypes.STRING
    },
    inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Course'
  });
  return Course;
}

module.exports = initCourse;