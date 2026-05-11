const personaRepository = require('../repositories/personaRepository');
const { ValidationError } = require('../utils/errors');

async function list({ q, visita } = {}) {
  return personaRepository.findAll({ q, visita });
}

async function create(data) {
  if (!data.mentor || !data.mentor.trim()) {
    throw new ValidationError('El campo mentor es obligatorio');
  }
  if (!data.nombre_completo || !data.nombre_completo.trim()) {
    throw new ValidationError('El campo nombre completo es obligatorio');
  }

  return personaRepository.create({
    mentor: data.mentor.trim(),
    invasor: (data.invasor || '').trim(),
    nombre_completo: data.nombre_completo.trim(),
    celular: (data.celular || '').trim(),
    barrio: (data.barrio || '').trim(),
    peticiones: (data.peticiones || '').trim(),
    quiere_visita: Boolean(data.quiere_visita),
    se_congrega_iglesia: Boolean(data.se_congrega_iglesia),
  });
}

module.exports = { list, create };
