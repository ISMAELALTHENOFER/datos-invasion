require('dotenv').config();

const express = require('express');
const path = require('path');
const initDb = require('./src/config/initDb');
const personasRouter = require('./src/routes/personas');
const mentoresRouter = require('./src/routes/mentores');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'views')));

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/personas', personasRouter);
app.use('/api/mentores', mentoresRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
  console.log('Inicializando base de datos...');
  await initDb();
  console.log('Base de datos lista.');

  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}

start().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
