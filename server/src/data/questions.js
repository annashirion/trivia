const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"]
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"]
  },
  {
    id: 3,
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"]
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"]
  },
  {
    id: 5,
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"]
  }
];

const correctAnswers = {
  1: 0, // Paris
  2: 1, // Mars
  3: 0, // Harper Lee
  4: 2, // Pacific Ocean
  5: 3  // JavaScript
};

module.exports = { questions, correctAnswers };


