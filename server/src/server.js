const express = require('express');
const cors = require('cors');
const { getQuestions } = require('./controllers/questionsController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/questions', getQuestions);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Trivia backend listening on port ${PORT}`);
});

module.exports = app;


