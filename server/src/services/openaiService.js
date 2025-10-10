const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate trivia questions using OpenAI API
 * @param {Object[]} topics - Array of topic objects with id, name, and description
 * @param {number} count - Number of questions to generate (default: 5)
 * @returns {Promise<Object[]>} Array of question objects
 */
async function generateQuestions(topics, count = 5) {
  try {
    // Create a detailed topics description for the prompt
    const topicsDescription = topics.map(topic => 
      `${topic.name} (${topic.id}): ${topic.description}`
    ).join('\n');
    
    const topicsString = topics.map(topic => topic.name).join(', ');
    
    const prompt = `Generate ${count} trivia questions for the following topics:

${topicsDescription}

For each question, provide:
- A clear, interesting question
- 4 multiple choice options (A, B, C, D)
- The correct answer (A, B, C, or D)
- The topic ID it belongs to

Return the response as a JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "topic": "topic_id",
    "correctAnswer": 0
  }
]

Important:
- Use the topic IDs exactly as provided: ${topics.map(t => t.id).join(', ')}
- Make sure the correctAnswer is the index (0-3) of the correct option
- Ensure questions are diverse and interesting
- Make sure all questions are appropriate for a general audience
- Use the topic descriptions to create relevant and accurate questions`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a trivia question generator. Always respond with valid JSON only, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content;
    
    // Parse the JSON response
    const questions = JSON.parse(responseText);
    
    // Validate the response structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected array');
    }
    
    // Validate each question
    questions.forEach((question, index) => {
      if (!question.id || !question.question || !Array.isArray(question.options) || 
          question.options.length !== 4 || typeof question.correctAnswer !== 'number' ||
          question.correctAnswer < 0 || question.correctAnswer > 3) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });
    
    return questions;
    
  } catch (error) {
    console.error('Error generating questions with OpenAI:', error);
    throw new Error('Failed to generate questions');
  }
}

module.exports = { generateQuestions };
