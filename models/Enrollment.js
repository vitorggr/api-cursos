const { DataTypes, Model } = require('sequelize');

class Enrollment extends Model {}

function initEnrollment(sequelize) {
  Enrollment.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    canceled_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Enrollment',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'course_id']
      }
    ]
  });
  return Enrollment;
}

module.exports = initEnrollment;