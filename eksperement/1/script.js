let phrases = [];
let currentPhraseIndex = 0;
let recognizing = false;

// Загрузка фраз из phrases.json
fetch('phrases.json')
  .then((response) => response.json())
  .then((data) => {
    phrases = data;
    document.getElementById('start-btn').disabled = false;
  })
  .catch((error) => console.error('Error loading phrases:', error));

// Инициализация распознавания речи
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Обработчик начала распознавания
recognition.onstart = () => {
  recognizing = true;
  document.getElementById('result').textContent = 'Listening...';
};

// Обработчик ошибок
recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
  document.getElementById('result').textContent = 'Error: Try again';
  recognizing = false;
};

// Обработчик завершения распознавания
recognition.onend = () => {
  recognizing = false;
  if (currentPhraseIndex < phrases.length - 1) {
    document.getElementById('next-btn').disabled = false;
  }
};

// Обработчик результатов распознавания
recognition.onresult = (event) => {
  const userPhrase = event.results[0][0].transcript.trim();
  const correctPhrase = phrases[currentPhraseIndex].toLowerCase();

  if (userPhrase.toLowerCase() === correctPhrase) {
    document.getElementById('result').textContent = 'Correct!';
  } else {
    document.getElementById('result').textContent = 'Incorrect. Listen to the correct phrase:';
    speakPhrase(phrases[currentPhraseIndex]);
  }
};

// Функция для произнесения фразы
function speakPhrase(phrase) {
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// Обработчик кнопки "Start"
document.getElementById('start-btn').addEventListener('click', () => {
  currentPhraseIndex = 0;
  document.getElementById('phrase').textContent = phrases[currentPhraseIndex];
  document.getElementById('result').textContent = '';
  document.getElementById('next-btn').disabled = true;
  recognition.start();
});

// Обработчик кнопки "Next"
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPhraseIndex < phrases.length - 1) {
    currentPhraseIndex++;
    document.getElementById('phrase').textContent = phrases[currentPhraseIndex];
    document.getElementById('result').textContent = '';
    document.getElementById('next-btn').disabled = true;
    recognition.start();
  } else {
    document.getElementById('result').textContent = 'You have completed all phrases!';
  }
});