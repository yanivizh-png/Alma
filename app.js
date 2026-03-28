const STORAGE_KEY = "kefelStatsV1";

const state = {
  left: null,
  right: null,
  stats: {
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
  },
};

const modeEl = document.getElementById("mode");
const focusNumberEl = document.getElementById("focusNumber");
const maxNumberEl = document.getElementById("maxNumber");
const questionTextEl = document.getElementById("questionText");
const answerInputEl = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");
const answerFormEl = document.getElementById("answerForm");
const newQuestionBtnEl = document.getElementById("newQuestionBtn");
const resetBtnEl = document.getElementById("resetBtn");

const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const accuracyEl = document.getElementById("accuracy");
const streakEl = document.getElementById("streak");
const bestStreakEl = document.getElementById("bestStreak");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSettings() {
  const mode = modeEl.value;
  const maxNumber = Math.min(20, Math.max(5, Number(maxNumberEl.value) || 10));
  const focusNumber = Math.min(12, Math.max(1, Number(focusNumberEl.value) || 6));

  maxNumberEl.value = String(maxNumber);
  focusNumberEl.value = String(focusNumber);

  return { mode, maxNumber, focusNumber };
}

function newQuestion() {
  const { mode, maxNumber, focusNumber } = getSettings();

  if (mode === "focus") {
    state.left = focusNumber;
    state.right = randomInt(1, maxNumber);
  } else {
    state.left = randomInt(1, maxNumber);
    state.right = randomInt(1, maxNumber);
  }

  questionTextEl.textContent = `${state.left} × ${state.right} = ?`;
  answerInputEl.value = "";
  answerInputEl.focus();
  setFeedback("");
}

function setFeedback(text, isSuccess = null) {
  feedbackEl.textContent = text;
  feedbackEl.classList.remove("success", "error");
  if (isSuccess === true) feedbackEl.classList.add("success");
  if (isSuccess === false) feedbackEl.classList.add("error");
}

function saveStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.correct === "number" &&
      typeof parsed.wrong === "number" &&
      typeof parsed.streak === "number" &&
      typeof parsed.bestStreak === "number"
    ) {
      state.stats = parsed;
    }
  } catch {
    // Ignore invalid localStorage data
  }
}

function updateStatsUI() {
  const { correct, wrong, streak, bestStreak } = state.stats;
  const total = correct + wrong;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  correctCountEl.textContent = String(correct);
  wrongCountEl.textContent = String(wrong);
  accuracyEl.textContent = `${accuracy}%`;
  streakEl.textContent = String(streak);
  bestStreakEl.textContent = String(bestStreak);
}

function handleAnswerSubmit(event) {
  event.preventDefault();

  if (state.left === null || state.right === null) {
    newQuestion();
    return;
  }

  const userAnswer = Number(answerInputEl.value);
  if (!Number.isFinite(userAnswer)) {
    setFeedback("נא להזין מספר תקין.", false);
    return;
  }

  const correctAnswer = state.left * state.right;

  if (userAnswer === correctAnswer) {
    state.stats.correct += 1;
    state.stats.streak += 1;
    state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.streak);
    setFeedback("מעולה! תשובה נכונה ✅", true);
  } else {
    state.stats.wrong += 1;
    state.stats.streak = 0;
    setFeedback(`לא מדויק. התשובה היא ${correctAnswer}.`, false);
  }

  updateStatsUI();
  saveStats();

  setTimeout(newQuestion, 550);
}

function handleModeChange() {
  focusNumberEl.disabled = modeEl.value !== "focus";
  newQuestion();
}

function resetStats() {
  state.stats = { correct: 0, wrong: 0, streak: 0, bestStreak: 0 };
  updateStatsUI();
  saveStats();
  setFeedback("הסטטיסטיקה אופסה.", true);
}

answerFormEl.addEventListener("submit", handleAnswerSubmit);
newQuestionBtnEl.addEventListener("click", newQuestion);
modeEl.addEventListener("change", handleModeChange);
maxNumberEl.addEventListener("change", newQuestion);
focusNumberEl.addEventListener("change", newQuestion);
resetBtnEl.addEventListener("click", resetStats);

loadStats();
updateStatsUI();
handleModeChange();
