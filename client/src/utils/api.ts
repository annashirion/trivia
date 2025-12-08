// Prefer VITE_API_URL; fallback to localhost with VITE_API_PORT or 4000
export const API_BASE = (import.meta as any).env.VITE_API_URL || `http://localhost:${(import.meta as any).env.VITE_API_PORT || 4000}`;

const QUESTION_HISTORY_KEY = 'trivia_question_history';
const MAX_HISTORY_SIZE = 100;

/**
 * Get previously asked questions from localStorage
 */
export function getQuestionHistory(): string[] {
  try {
    const history = localStorage.getItem(QUESTION_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

/**
 * Add new questions to history in localStorage
 */
export function addToQuestionHistory(questions: string[]): void {
  try {
    let history = getQuestionHistory();
    history = [...history, ...questions];
    
    // Keep only the most recent questions
    if (history.length > MAX_HISTORY_SIZE) {
      history = history.slice(-MAX_HISTORY_SIZE);
    }
    
    localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Silently fail if localStorage is full or disabled
  }
}
