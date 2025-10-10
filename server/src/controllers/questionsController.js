const { generateQuestions } = require('../services/openaiService');
const { storeQuestions } = require('../services/questionStore');
const { topics } = require('../data/topics');

async function getQuestions(req, res) {
  try {
    const { topicIndexes } = req.query;
    
    if (!topicIndexes) {
      return res.status(400).json({ error: 'Topic indexes parameter is required' });
    }
    
    // Parse topic indexes from query string (can be comma-separated)
    const selectedIndexes = topicIndexes.split(',').map(index => parseInt(index.trim()));
    
    if (selectedIndexes.length === 0 || selectedIndexes.some(index => isNaN(index))) {
      return res.status(400).json({ error: 'Invalid topic indexes provided' });
    }
    
    // Map indexes to topic data
    const selectedTopics = selectedIndexes
      .filter(index => index >= 0 && index < topics.length)
      .map(index => topics[index]);
    
    if (selectedTopics.length === 0) {
      return res.status(400).json({ error: 'No valid topics found for the provided indexes' });
    }
    
    // Generate questions using OpenAI with topic data
    const questions = await generateQuestions(selectedTopics, 5);
    
    // Store questions for answer checking
    storeQuestions(questions);
    
    // Remove correctAnswer from response (frontend doesn't need it)
    const questionsForClient = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      topic: q.topic
    }));
    
    res.json(questionsForClient);
    
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}

module.exports = { getQuestions };


