const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate general audio messages (welcome, results, etc.)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generateGeneralAudio(req, res) {
  try {
    const { type, data } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }
    
    let audioText;
    
    switch (type) {
      case 'welcome':
        audioText = "Welcome to Just Another Trivia! Select your topics and let's test your knowledge!";
        break;
        
      case 'results':
        const { score, totalQuestions } = data;
        const percentage = Math.round((score / totalQuestions) * 100);
        
        if (percentage === 100) {
          audioText = `Perfect! You got all ${totalQuestions} questions correct! Outstanding performance!`;
        } else if (percentage >= 80) {
          audioText = `Great job! You scored ${score} out of ${totalQuestions} questions. That's ${percentage} percent!`;
        } else if (percentage >= 60) {
          audioText = `Good effort! You scored ${score} out of ${totalQuestions} questions. That's ${percentage} percent. Keep practicing!`;
        } else {
          audioText = `You scored ${score} out of ${totalQuestions} questions. That's ${percentage} percent. Don't give up, try again!`;
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid audio type' });
    }
    
    console.log('Generating general audio:', { type, audioText });
    
    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: audioText,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString('base64');
    
    // Return base64 audio data
    res.json({
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      text: audioText
    });
    
  } catch (error) {
    console.error('Error generating general audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}

module.exports = { generateGeneralAudio };
