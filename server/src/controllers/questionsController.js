const { generateQuestions } = require('../services/openaiService');
const { storeQuestions } = require('../services/questionStore');
const { topics } = require('../data/topics');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    
    // Generate audio for each question (question + options + feedback audio)
    const questionsWithAudio = await Promise.all(
      questions.map(async (question) => {
        try {
          // Create full text including question and options
          const fullText = `${question.question} Options: ${question.options.join(', ')}`;
          
          const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: fullText,
          });
          
          const audioBuffer = Buffer.from(await mp3.arrayBuffer());
          const audioBase64 = audioBuffer.toString('base64');
          
          // Generate feedback audio for all possible answers
          const correctAnswerText = question.options[question.correctAnswer];
          const correctFeedbackText = `It's ${correctAnswerText}, you are right!`;
          const wrongFeedbackText = `Unfortunately you are wrong. The correct answer was ${correctAnswerText}.`;
          
          // Generate correct answer audio
          const correctMp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: correctFeedbackText,
          });
          const correctAudioBuffer = Buffer.from(await correctMp3.arrayBuffer());
          const correctAudioBase64 = correctAudioBuffer.toString('base64');
          
          // Generate wrong answer audio
          const wrongMp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: wrongFeedbackText,
          });
          const wrongAudioBuffer = Buffer.from(await wrongMp3.arrayBuffer());
          const wrongAudioBase64 = wrongAudioBuffer.toString('base64');
          
          return {
            id: question.id,
            question: question.question,
            options: question.options,
            topic: question.topic,
            correctAnswer: question.correctAnswer,
            audio: `data:audio/mpeg;base64,${audioBase64}`,
            feedbackAudio: {
              correct: `data:audio/mpeg;base64,${correctAudioBase64}`,
              wrong: `data:audio/mpeg;base64,${wrongAudioBase64}`
            }
          };
        } catch (audioError) {
          console.error(`Error generating audio for question ${question.id}:`, audioError);
          // Return question without audio if audio generation fails
          return {
            id: question.id,
            question: question.question,
            options: question.options,
            topic: question.topic,
            correctAnswer: question.correctAnswer,
            audio: null,
            feedbackAudio: null
          };
        }
      })
    );
    
    // Store questions with audio for answer checking
    storeQuestions(questionsWithAudio);
    
    res.json(questionsWithAudio);
    
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}

module.exports = { getQuestions };


