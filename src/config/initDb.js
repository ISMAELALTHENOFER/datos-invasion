const pool = require('./db');

const MENTORES = [
  'Ariel', 'Daniel O.', 'Daniela', 'Graciela',
  'Gustavo', 'Marita', 'Pastor David',
  'Pastora Cecilia', 'Sonia', 'Valeria',
  'Viviana Belén', 'Yesica',
];

async function initDb() {
  const connection = await pool.getConnection();

  try {
    await connection.query(`CREATE TABLE IF NOT EXISTS personas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mentor VARCHAR(255) NOT NULL,
      invasor VARCHAR(255) NOT NULL,
      nombre_completo VARCHAR(255) NOT NULL,
      celular VARCHAR(50),
      barrio VARCHAR(255),
      peticiones TEXT,
      quiere_visita BOOLEAN DEFAULT FALSE,
      se_congrega_iglesia BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await connection.query(`CREATE TABLE IF NOT EXISTS mentores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM mentores');

    if (rows[0].count === 0) {
      const placeholders = MENTORES.map(() => '(?)').join(', ');
      await connection.query(
        `INSERT IGNORE INTO mentores (nombre) VALUES ${placeholders}`,
        MENTORES
      );
      console.log(`  → ${MENTORES.length} mentores insertados`);
    } else {
      console.log(`  → ${rows[0].count} mentores existentes (sin cambios)`);
    }

    console.log('  ✓ Tabla personas');
    console.log('  ✓ Tabla mentores');
  } finally {
    connection.release();
  }
}

module.exports = initDb;
