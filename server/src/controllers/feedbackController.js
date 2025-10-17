const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate feedback audio (correct/wrong)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generateFeedbackAudio(req, res) {
  try {
    const { type, question, correctAnswer, selectedAnswer } = req.body;
    
    if (!type || !['correct', 'wrong'].includes(type)) {
      return res.status(400).json({ error: 'Type must be "correct" or "wrong"' });
    }
    
    let feedbackText;
    
    if (type === 'correct') {
      feedbackText = "Correct! Well done!";
    } else {
      feedbackText = `Wrong! The correct answer was ${correctAnswer}.`;
    }
    
    console.log('Generating feedback audio:', { type, feedbackText });
    
    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: feedbackText,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString('base64');
    
    // Return base64 audio data
    res.json({
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      text: feedbackText
    });
    
  } catch (error) {
    console.error('Error generating feedback audio:', error);
    res.status(500).json({ error: 'Failed to generate feedback audio' });
  }
}

module.exports = { generateFeedbackAudio };
