const { correctAnswers } = require('../data/questions');

function checkAnswer(req, res) {
  const { questionId, selectedIndex } = req.body;
  
  if (!questionId || selectedIndex === undefined) {
    return res.status(400).json({ error: 'questionId and selectedIndex are required' });
  }
  
  const correctIndex = correctAnswers[questionId];
  if (correctIndex === undefined) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  const isCorrect = selectedIndex === correctIndex;
  
  res.json({
    isCorrect,
    correctIndex,
    selectedIndex
  });
}

module.exports = { checkAnswer };
