const mentorRepository = require('../repositories/mentorRepository');

async function list() {
  return mentorRepository.findAll();
}

module.exports = { list };
