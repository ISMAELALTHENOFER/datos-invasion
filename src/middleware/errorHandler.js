const { AppError } = require('../utils/errors');

function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

function notFound(_req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

module.exports = { errorHandler, notFound };
