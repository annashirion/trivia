const { generateQuestions } = require('../services/openaiService');
const { storeQuestions } = require('../services/questionStore');
const { topics } = require('../data/topics');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate results audio for all possible scores (0-5 out of 5)
 */
async function generateResultsAudio() {
  const resultsTexts = [
    "You scored 0 out of 5 questions. That's 0 percent. Don't give up, try again!",
    "You scored 1 out of 5 questions. That's 20 percent. Keep practicing!",
    "You scored 2 out of 5 questions. That's 40 percent. You're getting there!",
    "You scored 3 out of 5 questions. That's 60 percent. Good job!",
    "You scored 4 out of 5 questions. That's 80 percent. Excellent work!",
    "You scored 5 out of 5 questions. That's 100 percent. Perfect! Outstanding performance!"
  ];

  const resultsAudio = {};

  try {
    for (let i = 0; i < resultsTexts.length; i++) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: resultsTexts[i],
      });

      const audioBuffer = Buffer.from(await mp3.arrayBuffer());
      const audioBase64 = audioBuffer.toString('base64');
      resultsAudio[i] = `data:audio/mpeg;base64,${audioBase64}`;
    }

    console.log('Generated results audio for all scores (0-5)');
    return resultsAudio;
  } catch (error) {
    console.error('Error generating results audio:', error);
    return {};
  }
}

async function getQuestions(req, res) {
  try {
    const { topicIndexes, previousQuestions = [] } = req.body;
    
    if (!topicIndexes || !Array.isArray(topicIndexes)) {
      return res.status(400).json({ error: 'Topic indexes array is required' });
    }
    
    if (topicIndexes.length === 0 || topicIndexes.some(index => typeof index !== 'number')) {
      return res.status(400).json({ error: 'Invalid topic indexes provided' });
    }
    
    // Map indexes to topic data
    const selectedTopics = topicIndexes
      .filter(index => index >= 0 && index < topics.length)
      .map(index => topics[index]);
    
    if (selectedTopics.length === 0) {
      return res.status(400).json({ error: 'No valid topics found for the provided indexes' });
    }
    
    console.log(`Generating questions, avoiding ${previousQuestions.length} previous questions`);
    
    // Generate questions using OpenAI with topic data and previous questions
    const questions = await generateQuestions(selectedTopics, 5, previousQuestions);
    
    // Generate audio for each question (question + options + feedback audio)
    const questionsWithAudio = await Promise.all(
      questions.map(async (question) => {
        try {
          // Create full text including question and options
          const fullText = `${question.question} ${question.options.join(', ')}`;
          
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
    
    // Generate results audio for all possible scores (0-5 out of 5)
    const resultsAudio = await generateResultsAudio();
    
    // Store questions with audio for answer checking
    storeQuestions(questionsWithAudio);
    
    // Return questions with results audio
    res.json({
      questions: questionsWithAudio,
      resultsAudio: resultsAudio
    });
    
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}

module.exports = { getQuestions };


