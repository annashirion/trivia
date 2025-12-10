// Load polyfills first, before any other modules
require('./polyfills');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { getQuestions, getQuestionAudio, getResultsAudio } = require('./controllers/questionsController');
const { getTopics } = require('./controllers/topicsController');
const { checkAnswer } = require('./controllers/answersController');
const { generateFeedbackAudio } = require('./controllers/feedbackController');
const { generateGeneralAudio } = require('./controllers/audioController');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/questions', getQuestions);
app.get('/api/question-audio/:id', getQuestionAudio);
app.get('/api/results-audio', getResultsAudio);
app.get('/api/topics', getTopics);
app.post('/api/check-answer', checkAnswer);
app.post('/api/feedback-audio', generateFeedbackAudio);
app.post('/api/general-audio', generateGeneralAudio);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Trivia backend listening on port ${PORT}`);
});

module.exports = app;


