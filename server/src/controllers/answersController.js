const { getCorrectAnswer, getQuestion } = require('../services/questionStore');

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
  
  // Get the question data to access pre-generated feedback audio
  const question = getQuestion(questionId);
  let feedbackAudio = null;
  
  if (question && question.feedbackAudio) {
    feedbackAudio = isCorrect ? question.feedbackAudio.correct : question.feedbackAudio.wrong;
  }
  
  res.json({
    isCorrect,
    correctIndex,
    selectedIndex,
    feedbackAudio
  });
}

module.exports = { checkAnswer };
