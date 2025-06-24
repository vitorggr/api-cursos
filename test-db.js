const db = require('./config/db');

async function test() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Conexão OK! Hora atual do banco:', res.rows[0].now);
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}

test();