require('dotenv').config();

// Add fetch polyfill for Node.js 18
if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

const express = require('express');
const cors = require('cors');
const { getQuestions } = require('./controllers/questionsController');
const { getTopics } = require('./controllers/topicsController');
const { checkAnswer } = require('./controllers/answersController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/questions', getQuestions);
app.get('/api/topics', getTopics);
app.post('/api/check-answer', checkAnswer);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Trivia backend listening on port ${PORT}`);
});

module.exports = app;


