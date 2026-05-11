const { Router } = require('express');
const mentorService = require('../services/mentorService');

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const mentores = await mentorService.list();
    res.json(mentores);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
