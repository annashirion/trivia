const { processQuestions } = require('../services/questionsService');
const { getQuestion, updateQuestionAudio } = require('../services/questionStore');
const { generateQuestionAudioWithFeedback, generateResultsAudio } = require('../services/audioService');

/**
 * Get questions without audio (fast initial load)
 */
async function getQuestions(req, res) {
  try {
    const { topicIndexes, previousQuestions = [] } = req.body;
    
    const result = await processQuestions(topicIndexes, previousQuestions);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}

/**
 * Generate audio for a specific question by ID
 */
async function getQuestionAudio(req, res) {
  try {
    const questionId = parseInt(req.params.id);
    
    if (isNaN(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID' });
    }
    
    const storedQuestion = getQuestion(questionId);
    
    if (!storedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const { audio, feedbackAudio } = await generateQuestionAudioWithFeedback(storedQuestion);
    
    updateQuestionAudio(questionId, audio, feedbackAudio);
    
    res.json({
      questionId,
      audio,
      feedbackAudio
    });
    
  } catch (error) {
    console.error('Error in getQuestionAudio:', error);
    res.status(500).json({ error: 'Failed to generate question audio' });
  }
}

/**
 * Generate results audio for all possible scores
 */
async function getResultsAudio(req, res) {
  try {
    const resultsAudio = await generateResultsAudio();
    res.json({ resultsAudio });
  } catch (error) {
    console.error('Error in getResultsAudio:', error);
    res.status(500).json({ error: 'Failed to generate results audio' });
  }
}

module.exports = { getQuestions, getQuestionAudio, getResultsAudio };
