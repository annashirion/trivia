const { getCorrectAnswer } = require('../services/questionStore');

function checkAnswer(req, res) {
  const { questionId, selectedIndex } = req.body;
  
  if (!questionId || selectedIndex === undefined) {
    return res.status(400).json({ error: 'questionId and selectedIndex are required' });
  }
  
  const correctIndex = getCorrectAnswer(questionId);
  if (correctIndex === null) {
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
