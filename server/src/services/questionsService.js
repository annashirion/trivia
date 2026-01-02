const { generateQuestions } = require('./questionGenerator');
const { storeQuestions } = require('./questionStore');
const { topics } = require('../data/topics');

/**
 * Select topics by indexes
 * @param {number[]} topicIndexes - Array of topic indexes
 * @returns {Object} Object with selectedTopics array or error
 */
function selectTopicsByIndexes(topicIndexes) {
  if (!topicIndexes || !Array.isArray(topicIndexes)) {
    return { error: 'Topic indexes array is required' };
  }

  if (topicIndexes.length === 0 || topicIndexes.some(index => typeof index !== 'number')) {
    return { error: 'Invalid topic indexes provided' };
  }

  const selectedTopics = topicIndexes
    .filter(index => index >= 0 && index < topics.length)
    .map(index => topics[index]);

  if (selectedTopics.length === 0) {
    return { error: 'No valid topics found for the provided indexes' };
  }

  return { selectedTopics };
}

/**
 * Generate questions with retry logic
 * @param {Object[]} selectedTopics - Array of topic objects
 * @param {string[]} previousQuestions - Array of previously asked questions
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Object>} Object with questions array and retryAttempted flag
 */
async function generateQuestionsWithRetry(selectedTopics, previousQuestions = [], count = 5) {
  let questions;
  let retryAttempted = false;

  try {
    questions = await generateQuestions(selectedTopics, count, previousQuestions);
  } catch (error) {
    // Retry once
    try {
      retryAttempted = true;
      questions = await generateQuestions(selectedTopics, count, previousQuestions);
    } catch (retryError) {
      throw retryError;
    }
  }

  return { questions, retryAttempted };
}

/**
 * Transform questions for storage (exclude audio fields initially)
 * @param {Object[]} questions - Array of question objects
 * @returns {Object[]} Array of questions formatted for storage
 */
function formatQuestionsForStore(questions) {
  return questions.map(question => ({
    id: question.id,
    question: question.question,
    options: question.options,
    topic: question.topic,
    correctAnswer: question.correctAnswer,
    audio: null,
    feedbackAudio: null
  }));
}

/**
 * Transform questions for client (exclude correctAnswer)
 * @param {Object[]} questions - Array of question objects
 * @returns {Object[]} Array of questions formatted for client
 */
function formatQuestionsForClient(questions) {
  return questions.map(({ id, question, options }) => ({
    id,
    question,
    options
  }));
}

/**
 * Process and store questions
 * @param {number[]} topicIndexes - Array of topic indexes
 * @param {string[]} previousQuestions - Array of previously asked questions
 * @returns {Promise<Object>} Object with questions for client and retryAttempted flag, or error
 */
async function processQuestions(topicIndexes, previousQuestions = []) {
  const topicResult = selectTopicsByIndexes(topicIndexes);
  if (topicResult.error) {
    return { error: topicResult.error };
  }

  const { selectedTopics } = topicResult;

  const { questions, retryAttempted } = await generateQuestionsWithRetry(
    selectedTopics,
    previousQuestions,
    5
  );

  const questionsForStore = formatQuestionsForStore(questions);
  storeQuestions(questionsForStore);

  const questionsForClient = formatQuestionsForClient(questions);

  return {
    questions: questionsForClient,
    retryAttempted
  };
}

module.exports = {
  processQuestions
};

