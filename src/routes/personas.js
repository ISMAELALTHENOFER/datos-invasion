const { Router } = require('express');
const personaService = require('../services/personaService');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const personas = await personaService.list({
      q: req.query.q,
      visita: req.query.visita,
    });
    res.json(personas);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const persona = await personaService.create(req.body);
    res.status(201).json(persona);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
