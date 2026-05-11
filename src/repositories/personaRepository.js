const pool = require('../config/db');

function personaFromDb(row) {
  return {
    id: row.id,
    mentor: row.mentor,
    invasor: row.invasor,
    nombre_completo: row.nombre_completo,
    celular: row.celular,
    barrio: row.barrio,
    peticiones: row.peticiones,
    quiere_visita: Boolean(row.quiere_visita),
    se_congrega_iglesia: Boolean(row.se_congrega_iglesia),
    created_at: row.created_at,
  };
}

async function findAll({ q, visita } = {}) {
  let query = 'SELECT * FROM personas WHERE 1=1';
  const params = [];

  if (q && q.trim().length >= 3) {
    const term = `%${q.trim()}%`;
    query += ' AND (nombre_completo LIKE ? OR barrio LIKE ? OR mentor LIKE ? OR invasor LIKE ?)';
    params.push(term, term, term, term);
  }

  if (visita === 'true' || visita === '1') {
    query += ' AND quiere_visita = 1';
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute(query, params);
  return rows.map(personaFromDb);
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM personas WHERE id = ?', [id]);
  return rows.length ? personaFromDb(rows[0]) : null;
}

async function create(data) {
  const [result] = await pool.execute(
    `INSERT INTO personas (mentor, invasor, nombre_completo, celular, barrio, peticiones, quiere_visita, se_congrega_iglesia)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.mentor,
      data.invasor || '',
      data.nombre_completo,
      data.celular || '',
      data.barrio || '',
      data.peticiones || '',
      data.quiere_visita ? 1 : 0,
      data.se_congrega_iglesia ? 1 : 0,
    ]
  );
  return findById(result.insertId);
}

module.exports = { findAll, findById, create };
