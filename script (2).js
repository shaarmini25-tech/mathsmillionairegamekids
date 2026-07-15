const questions = [
  {
    question: "What number comes after 19?",
    answers: ["18", "20", "21", "29"],
    correct: 1,
    hint: "Count forward: 17, 18, 19, ...",
    explanation: "The number after 19 is 20."
  },
  {
    question: "6 + 3 = ?",
    answers: ["8", "9", "10", "7"],
    correct: 1,
    hint: "Start from 6 and count 3 more.",
    explanation: "6 + 3 = 9."
  },
  {
    question: "Which number is bigger?",
    answers: ["12", "21", "9", "15"],
    correct: 1,
    hint: "Compare the tens digit first.",
    explanation: "21 is the biggest number because it has 2 tens."
  },
  {
    question: "Which shape has 3 sides?",
    answers: ["Circle", "Square", "Triangle", "Rectangle"],
    correct: 2,
    hint: "The word 'tri' means three.",
    explanation: "A triangle has 3 sides."
  },
  {
    question: "10 - 4 = ?",
    answers: ["5", "6", "7", "4"],
    correct: 1,
    hint: "Count backwards four steps from 10.",
    explanation: "10 - 4 = 6."
  },
  {
    question: "How many sen are there in RM1?",
    answers: ["10 sen", "50 sen", "100 sen", "20 sen"],
    correct: 2,
    hint: "RM1 is equal to one hundred sen.",
    explanation: "RM1 = 100 sen."
  },
  {
    question: "Which object is usually used to measure length?",
    answers: ["Ruler", "Cup", "Clock", "Coin"],
    correct: 0,
    hint: "Students use it to draw straight lines.",
    explanation: "A ruler is used to measure length."
  },
  {
    question: "25 + 14 = ?",
    answers: ["38", "39", "40", "41"],
    correct: 1,
    hint: "Add tens and ones separately.",
    explanation: "25 + 14 = 39."
  },
  {
    question: "46 - 12 = ?",
    answers: ["32", "34", "36", "38"],
    correct: 1,
    hint: "46 - 10 = 36, then minus 2 more.",
    explanation: "46 - 12 = 34."
  },
  {
    question: "What is 5 groups of 2?",
    answers: ["7", "10", "12", "15"],
    correct: 1,
    hint: "This is 5 × 2.",
    explanation: "5 groups of 2 equals 10."
  },
  {
    question: "Half of 12 is?",
    answers: ["4", "5", "6", "8"],
    correct: 2,
    hint: "Share 12 equally into 2 groups.",
    explanation: "Half of 12 is 6."
  },
  {
    question: "Which time shows half past 3?",
    answers: ["3:00", "3:15", "3:30", "4:30"],
    correct: 2,
    hint: "Half past means 30 minutes after the hour.",
    explanation: "Half past 3 is 3:30."
  },
  {
    question: "RM2.00 + RM1.50 = ?",
    answers: ["RM2.50", "RM3.00", "RM3.50", "RM4.00"],
    correct: 2,
    hint: "Add ringgit and sen together.",
    explanation: "RM2.00 + RM1.50 = RM3.50."
  },
  {
    question: "A rectangle has how many sides?",
    answers: ["3", "4", "5", "6"],
    correct: 1,
    hint: "It has the same number of sides as a square.",
    explanation: "A rectangle has 4 sides."
  },
  {
    question: "There are 18 apples. If they are shared equally among 3 children, each child gets?",
    answers: ["5", "6", "7", "8"],
    correct: 1,
    hint: "Think of 18 ÷ 3.",
    explanation: "18 ÷ 3 = 6, so each child gets 6 apples."
  }
];

const scores = [
  "RM100", "RM200", "RM500", "RM1,000", "RM2,000",
  "RM5,000", "RM10,000", "RM25,000", "RM50,000", "RM100,000",
  "RM250,000", "RM500,000", "RM600,000", "RM750,000", "RM1,000,000"
];

let currentQuestion = 0;
let playerName = "Student";
let audioContext;

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const popup = document.getElementById("popup");

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, duration, type = "sine", volume = 0.08, delay = 0) {
  initAudio();

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(audioContext.destination);

  const start = audioContext.currentTime + delay;
  osc.start(start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.stop(start + duration);
}

function playStartSound() {
  playTone(392, 0.18, "sine", 0.08, 0);
  playTone(523, 0.18, "sine", 0.08, 0.2);
  playTone(659, 0.22, "sine", 0.09, 0.42);
}

function playVictorySound() {
  playTone(659, 0.12, "triangle", 0.12, 0);
  playTone(784, 0.12, "triangle", 0.12, 0.12);
  playTone(988, 0.14, "triangle", 0.13, 0.24);
  playTone(1318, 0.18, "triangle", 0.14, 0.38);
  playTone(1568, 0.28, "triangle", 0.15, 0.6);
  playTone(1318, 0.18, "triangle", 0.13, 0.9);
  playTone(1568, 0.35, "triangle", 0.15, 1.08);
}

function playWrongSound() {
  playTone(220, 0.25, "sawtooth", 0.06, 0);
  playTone(165, 0.35, "sawtooth", 0.05, 0.25);
}

function playFinalWinSound() {
  playTone(523, 0.15, "triangle", 0.1, 0);
  playTone(659, 0.15, "triangle", 0.1, 0.16);
  playTone(784, 0.15, "triangle", 0.1, 0.32);
  playTone(1046, 0.2, "triangle", 0.12, 0.5);
  playTone(1318, 0.2, "triangle", 0.12, 0.75);
  playTone(1568, 0.45, "triangle", 0.14, 1.0);
}

function startGame() {
  const nameInput = document.getElementById("player-name").value.trim();
  playerName = nameInput || "Student";
  currentQuestion = 0;

  playStartSound();

  document.getElementById("player-display").textContent = playerName;
  startScreen.classList.remove("active");
  endScreen.classList.remove("active");
  gameScreen.classList.add("active");

  buildPrizeLadder();
  loadQuestion();
}

function buildPrizeLadder() {
  const ladder = document.getElementById("prize-ladder");
  ladder.innerHTML = "";

  scores.slice().reverse().forEach((score, index) => {
    const actualLevel = scores.length - 1 - index;
    const li = document.createElement("li");
    li.id = `ladder-${actualLevel}`;
    li.innerHTML = `<span>Q${actualLevel + 1}</span><span>${score}</span>`;
    ladder.appendChild(li);
  });
}

function loadQuestion() {
  document.getElementById("hint-btn").disabled = false;

  const q = questions[currentQuestion];
  document.getElementById("question-text").textContent = q.question;
  document.getElementById("level-display").textContent = `${currentQuestion + 1} / ${questions.length}`;
  document.getElementById("prize-display").textContent = scores[currentQuestion];

  document.querySelectorAll(".prize-ladder li").forEach(li => li.classList.remove("active-level"));
  const activeLevel = document.getElementById(`ladder-${currentQuestion}`);
  if (activeLevel) activeLevel.classList.add("active-level");

  const answerBox = document.getElementById("answers");
  answerBox.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.innerHTML = `<span class="answer-prefix">${String.fromCharCode(65 + index)}:</span> ${answer}`;
    button.onclick = () => checkAnswer(index);
    answerBox.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  const q = questions[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  if (isCorrect) {
    playVictorySound();

    showPopup(
      "🎉 Correct Answer!",
      `${q.explanation}\n\n🏆 You won: ${scores[currentQuestion]}`,
      currentQuestion === questions.length - 1 ? finishWinner : nextQuestion
    );
  } else {
    playWrongSound();

    showPopup(
      "❌ Try Again Next Time",
      `The correct answer is ${q.answers[q.correct]}.\n\n${q.explanation}`,
      () => finishGame()
    );
  }
}

function nextQuestion() {
  currentQuestion++;
  hidePopup();

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    finishWinner();
  }
}

function showHint() {
  const q = questions[currentQuestion];
  document.getElementById("hint-btn").disabled = true;

  showPopup(
    "🤖 AI Hint",
    `${q.hint}\n\nAI Tip: Think step by step before choosing your answer.`,
    hidePopup
  );
}

function quitGame() {
  finishGame(true);
}

function finishWinner() {
  hidePopup();
  playFinalWinSound();

  gameScreen.classList.remove("active");
  endScreen.classList.add("active");

  document.getElementById("end-title").textContent = "🏆 Millionaire Winner!";
  document.getElementById("end-message").textContent =
    `Congratulations ${playerName}! You completed all questions and won RM1,000,000.`;
}

function finishGame(quit = false) {
  hidePopup();

  gameScreen.classList.remove("active");
  endScreen.classList.add("active");

  const previousScore = currentQuestion > 0 ? scores[currentQuestion - 1] : "RM0";

  document.getElementById("end-title").textContent = quit ? "Game Ended" : "Game Over";
  document.getElementById("end-message").textContent =
    `${playerName}, your final winning amount is ${previousScore}.`;
}

function restartGame() {
  endScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function showPopup(title, message, action) {
  document.getElementById("popup-title").textContent = title;
  document.getElementById("popup-message").textContent = message;
  document.getElementById("popup-button").textContent = "Continue";
  document.getElementById("popup-button").onclick = action;
  popup.classList.remove("hidden");
}

function hidePopup() {
  popup.classList.add("hidden");
}
