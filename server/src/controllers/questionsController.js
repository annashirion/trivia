const { questions } = require('../data/questions');

function getQuestions(req, res) {
  res.json(questions);
}

module.exports = { getQuestions };


