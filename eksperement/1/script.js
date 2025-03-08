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
  .catch((error) => console.error('Ошибка загрузки фраз:', error));

// Инициализация распознавания речи
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Обработчик начала распознавания
recognition.onstart = () => {
  recognizing = true;
  document.getElementById('result').textContent = 'Слушаю...';
};

// Обработчик ошибок
recognition.onerror = (event) => {
  console.error('Ошибка распознавания:', event.error);
  document.getElementById('result').textContent = 'Ошибка: Попробуйте еще раз';
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
    document.getElementById('result').textContent = 'Верно!';
  } else {
    document.getElementById('result').textContent = 'Ошибка. Слушайте правильное произношение:';
    speakPhrase(phrases[currentPhraseIndex]);
  }
};

// Функция для произнесения фразы
function speakPhrase(phrase) {
  const utterance = new SpeechSynthesisUtterance(phrase);
  const accent = document.getElementById('accent').value; // Получаем выбранный акцент
  utterance.lang = accent; // Устанавливаем акцент
  utterance.rate = parseFloat(document.getElementById('speed').value); // Устанавливаем скорость
  speechSynthesis.speak(utterance);
}

// Обработчик кнопки "Начать"
document.getElementById('start-btn').addEventListener('click', () => {
  currentPhraseIndex = 0;
  document.getElementById('phrase').textContent = phrases[currentPhraseIndex];
  document.getElementById('result').textContent = '';
  document.getElementById('next-btn').disabled = true;
  recognition.start();
});

// Обработчик кнопки "Следующая фраза"
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPhraseIndex < phrases.length - 1) {
    currentPhraseIndex++;
    document.getElementById('phrase').textContent = phrases[currentPhraseIndex];
    document.getElementById('result').textContent = '';
    document.getElementById('next-btn').disabled = true;
    recognition.start();
  } else {
    document.getElementById('result').textContent = 'Вы завершили все фразы!';
  }
});

// Обработчик изменения скорости произношения
document.getElementById('speed').addEventListener('input', (event) => {
  document.getElementById('speed-value').textContent = event.target.value;
});