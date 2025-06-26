// src/config/migrate.js
const { sequelize } = require('./database');
const fs = require('fs');

async function migrate() {
  try {
    const sql = fs.readFileSync('./sql/init.sql', 'utf8');
    await sequelize.query(sql);
    console.log('✅ Banco de dados configurado');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    process.exit();
  }
}

migrate();