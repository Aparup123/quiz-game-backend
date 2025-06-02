const questions = [
  {
    question: "What is the capital of Japan?",
    options: [
      { number: 1, content: "Tokyo", isCorrect: true },
      { number: 2, content: "Seoul", isCorrect: false },
      { number: 3, content: "Beijing", isCorrect: false },
      { number: 4, content: "Bangkok", isCorrect: false }
    ],
    type: "mcq",
    points: 10,
    tags: ["geography", "asia", "capitals"],
    difficulty: 3
  },
  {
    question: "Which of these are JavaScript data types?",
    options: [
      { number: 1, content: "String", isCorrect: true },
      { number: 2, content: "Boolean", isCorrect: true },
      { number: 3, content: "Integer", isCorrect: false },
      { number: 4, content: "Undefined", isCorrect: true }
    ],
    type: "msq",
    points: 20,
    tags: ["programming", "javascript", "basics"],
    difficulty: 6
  },
  {
    question: "Is Python a compiled language?",
    options: [
      { number: 1, content: "True", isCorrect: false },
      { number: 2, content: "False", isCorrect: true }
    ],
    type: "boolean",
    points: 10,
    tags: ["programming", "python", "basics"],
    difficulty: 4
  },
  {
    question: "What does HTML stand for?",
    options: [
      { number: 1, content: "HyperText Markup Language", isCorrect: true },
      { number: 2, content: "HighText Machine Language", isCorrect: false },
      { number: 3, content: "HyperText Machine Language", isCorrect: false },
      { number: 4, content: "HighText Markup Language", isCorrect: false }
    ],
    type: "mcq",
    points: 10,
    tags: ["web", "html", "basics"],
    difficulty: 2
  },
  {
    question: "What year was JavaScript created?",
    options: [
      { number: 1, content: "1995", isCorrect: true },
      { number: 2, content: "1994", isCorrect: false },
      { number: 3, content: "1996", isCorrect: false },
      { number: 4, content: "1991", isCorrect: false }
    ],
    type: "mcq",
    points: 15,
    tags: ["programming", "javascript", "history"],
    difficulty: 7
  },
  {
    question: "Which of these are valid HTTP methods?",
    options: [
      { number: 1, content: "GET", isCorrect: true },
      { number: 2, content: "POST", isCorrect: true },
      { number: 3, content: "SEND", isCorrect: false },
      { number: 4, content: "PUT", isCorrect: true }
    ],
    type: "msq",
    points: 20,
    tags: ["web", "http", "api"],
    difficulty: 5
  },
  {
    question: "What is 2^8?",
    options: [
      { number: 1, content: "256", isCorrect: true },
      { number: 2, content: "128", isCorrect: false },
      { number: 3, content: "512", isCorrect: false },
      { number: 4, content: "64", isCorrect: false }
    ],
    type: "mcq",
    points: 10,
    tags: ["math", "computation"],
    difficulty: 4
  },
  {
    question: "Which planets in our solar system have rings?",
    options: [
      { number: 1, content: "Saturn", isCorrect: true },
      { number: 2, content: "Uranus", isCorrect: true },
      { number: 3, content: "Neptune", isCorrect: true },
      { number: 4, content: "Mars", isCorrect: false }
    ],
    type: "msq",
    points: 25,
    tags: ["science", "astronomy", "planets"],
    difficulty: 8
  },
  {
    question: "Is JSON a programming language?",
    options: [
      { number: 1, content: "True", isCorrect: false },
      { number: 2, content: "False", isCorrect: true }
    ],
    type: "boolean",
    points: 10,
    tags: ["programming", "json", "basics"],
    difficulty: 3
  },
  {
    question: "What is the main index file name used in most web servers?",
    options: [
      { number: 1, content: "index.html", isCorrect: true },
      { number: 2, content: "main.html", isCorrect: false },
      { number: 3, content: "default.html", isCorrect: false },
      { number: 4, content: "home.html", isCorrect: false }
    ],
    type: "mcq",
    points: 15,
    tags: ["web", "servers", "basics"],
    difficulty: 4
  }
];

export default questions;