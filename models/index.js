const sequelize = require('../config/database');
const initUser = require('./User');
const initCourse = require('./Course');
const initEnrollment = require('./Enrollment');

const User = initUser(sequelize);
const Course = initCourse(sequelize);
const Enrollment = initEnrollment(sequelize);

// Definir associações
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'user_id',
  otherKey: 'course_id'
});

Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'course_id',
  otherKey: 'user_id'
});

// Sincronizar com o banco
dbSync();

async function dbSync() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com sucesso');
  } catch (err) {
    console.error('Erro na sincronização:', err);
  }
}

module.exports = {
  User,
  Course,
  Enrollment
};