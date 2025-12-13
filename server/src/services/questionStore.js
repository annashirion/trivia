// In-memory store for current session questions and answers
// In a production app, this would be replaced with a proper database
let currentQuestions = new Map();

/**
 * Store questions and their correct answers for the current session
 * @param {Array} questions - Array of question objects with correctAnswer field
 */
function storeQuestions(questions) {
  currentQuestions.clear();
  questions.forEach(question => {
    currentQuestions.set(question.id, {
      correctAnswer: question.correctAnswer,
      question: question.question,
      options: question.options,
      topic: question.topic,
      feedbackAudio: question.feedbackAudio
    });
  });
}

/**
 * Get the correct answer for a question
 * @param {number} questionId - The question ID
 * @returns {number|null} The correct answer index or null if not found
 */
function getCorrectAnswer(questionId) {
  const question = currentQuestions.get(questionId);
  return question ? question.correctAnswer : null;
}

/**
 * Get a question by ID
 * @param {number} questionId - The question ID
 * @returns {Object|null} The question object or null if not found
 */
function getQuestion(questionId) {
  return currentQuestions.get(questionId) || null;
}

/**
 * Get all stored questions
 * @returns {Array} Array of stored questions
 */
function getAllQuestions() {
  return Array.from(currentQuestions.values());
}

/**
 * Clear all stored questions
 */
function clearQuestions() {
  currentQuestions.clear();
}

/**
 * Update audio data for a specific question
 * @param {number} questionId - The question ID
 * @param {string} audio - The question audio data
 * @param {Object} feedbackAudio - The feedback audio data (correct/wrong)
 */
function updateQuestionAudio(questionId, audio, feedbackAudio) {
  const question = currentQuestions.get(questionId);
  if (question) {
    question.audio = audio;
    question.feedbackAudio = feedbackAudio;
    currentQuestions.set(questionId, question);
  }
}

module.exports = {
  storeQuestions,
  getCorrectAnswer,
  getQuestion,
  getAllQuestions,
  clearQuestions,
  updateQuestionAudio
};
