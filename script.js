let currentQuestionIndex = 0;
let questions = [];

// Загрузка вопросов из JSON-файла
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    })
    .catch(error => console.error('Ошибка загрузки вопросов:', error));

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Случайный индекс от 0 до i
        [array[i], array[j]] = [array[j], array[i]]; // Меняем местами элементы
    }
    return array;
}

// Функция для отображения вопроса и вариантов ответа
function showQuestion() {
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const resultText = document.getElementById('result-text');

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;

        // Очищаем контейнер с вариантами ответа
        optionsContainer.innerHTML = '';

        // Перемешиваем варианты ответа
        const shuffledOptions = shuffleArray([...question.options]);

        // Добавляем перемешанные варианты ответа
        shuffledOptions.forEach((option) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectOption(optionElement));
            optionsContainer.appendChild(optionElement);
        });

        resultText.textContent = '';
    } else {
        questionText.textContent = 'Тест завершен!';
        optionsContainer.style.display = 'none';
        document.getElementById('check-answer').style.display = 'none';
        document.getElementById('speak-question').style.display = 'none';
        document.getElementById('next-question').style.display = 'none';
    }
}

// Функция для выбора варианта ответа
function selectOption(selectedOption) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    selectedOption.classList.add('selected');
}

// Функция для проверки ответа
document.getElementById('check-answer').addEventListener('click', () => {
    const selectedOption = document.querySelector('.option.selected');
    const resultText = document.getElementById('result-text');
    const question = questions[currentQuestionIndex];

    if (selectedOption) {
        if (selectedOption.textContent === question.answer) {
            resultText.textContent = 'Правильно!';
            resultText.style.color = 'green';
        } else {
            resultText.textContent = `Неправильно. Правильный ответ: ${question.answer}`;
            resultText.style.color = 'red';
        }
    } else {
        resultText.textContent = 'Выберите вариант ответа!';
    }
});

// Функция для озвучки вопроса
document.getElementById('speak-question').addEventListener('click', () => {
    const question = questions[currentQuestionIndex];
    speakText(question.question);
});

// Функция для перехода к следующему вопросу
document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});

// Функция для озвучки текста
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Female'));

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        } else {
            console.warn('Женский английский голос не найден. Будет использован голос по умолчанию.');
        }

        utterance.rate = 0.8;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    } else {
        alert('Ваш браузер не поддерживает озвучку текста.');
    }
}
