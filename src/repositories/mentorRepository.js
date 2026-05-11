const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.execute(
    'SELECT id, nombre FROM mentores ORDER BY nombre ASC'
  );
  return rows;
}

module.exports = { findAll };
