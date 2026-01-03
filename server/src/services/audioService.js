const OpenAI = require('openai');
const { resultsTexts } = require('../data/resultsTexts');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate audio from text using OpenAI TTS
 * @param {string} text - The text to convert to speech
 * @returns {Promise<string>} Base64 encoded audio data URI
 */
async function generateAudioFromText(text) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
  });

  const audioBuffer = Buffer.from(await mp3.arrayBuffer());
  const audioBase64 = audioBuffer.toString('base64');
  return `data:audio/mpeg;base64,${audioBase64}`;
}

/**
 * Generate results audio for all possible scores (0-5 out of 5)
 * @returns {Promise<Object>} Object mapping score (0-5) to audio data URI
 */
async function generateResultsAudio() {
  const resultsAudio = {};

  try {
    for (let i = 0; i < resultsTexts.length; i++) {
      resultsAudio[i] = await generateAudioFromText(resultsTexts[i]);
    }

    return resultsAudio;
  } catch (error) {
    console.error('Error generating results audio:', error);
    return {};
  }
}

/**
 * Generate question audio (question text + options)
 * @param {string} question - The question text
 * @param {string[]} options - Array of option strings
 * @returns {Promise<string>} Base64 encoded audio data URI
 */
async function generateQuestionAudio(question, options) {
  const fullText = `${question} ${options.join(', ')}`;
  return await generateAudioFromText(fullText);
}

/**
 * Generate feedback audio for correct and wrong answers
 * @param {string} correctAnswerText - The text of the correct answer
 * @returns {Promise<Object>} Object with 'correct' and 'wrong' audio data URIs
 */
async function generateFeedbackAudio(correctAnswerText) {
  const correctFeedbackText = `It's ${correctAnswerText}, you are right!`;
  const wrongFeedbackText = `Unfortunately you are wrong. The correct answer was ${correctAnswerText}.`;

  const [correctAudio, wrongAudio] = await Promise.all([
    generateAudioFromText(correctFeedbackText),
    generateAudioFromText(wrongFeedbackText)
  ]);

  return {
    correct: correctAudio,
    wrong: wrongAudio
  };
}

/**
 * Generate complete audio for a question (question + feedback)
 * @param {Object} question - Question object with question, options, and correctAnswer
 * @returns {Promise<Object>} Object with audio and feedbackAudio
 */
async function generateQuestionAudioWithFeedback(question) {
  const { question: questionText, options, correctAnswer } = question;
  
  const correctAnswerText = options[correctAnswer];
  
  const [audio, feedbackAudio] = await Promise.all([
    generateQuestionAudio(questionText, options),
    generateFeedbackAudio(correctAnswerText)
  ]);

  return {
    audio,
    feedbackAudio
  };
}

module.exports = {
  generateResultsAudio,
  generateQuestionAudioWithFeedback
};

