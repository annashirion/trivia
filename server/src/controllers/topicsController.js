const { topics } = require('../data/topics');

function getTopics(req, res) {
  res.json(topics);
}

module.exports = { getTopics };
