document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const quizContainer = document.getElementById('quizContainer');
    const questionsDiv = document.getElementById('questions');
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');
    const quizGameCount = document.querySelector('.count');
    const timerDisplay = document.getElementById('timerDisplay');
    const scoreDisplay = document.getElementById('scoreDisplay');

    let correctAnswers = 0;
    let selectedQuestionCount = 0;
    let currentQuestionIndex = 0;
    let selectedQuestions = [];
    let userAnswers = {};
    let timeLeft = 300;
    let timerInterval;

    const quizOptions = document.querySelectorAll('input[name="questionCount"]');
    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedQuestionCount = parseInt(option.value);
            resetQuiz();
            loadQuestions(selectedQuestionCount);
            quizForm.style.display = 'none';
            quizContainer.style.display = 'block';
            quizGameCount.style.display = 'none';
            displayQuestion(selectedQuestions[currentQuestionIndex]);
            startTimer();
            updateTimerDisplay();
        });
    });

    // Array of questions
    const questions = [
        {
            question: "Which HTML element is used to define the title of a document?",
            options: [
                "a. <meta>",
                "b. <title>",
                "c. <head>",
                "d. <body>"
            ],
            answer: "b. <title>"
        },
        {
            question: "How can you make a numbered list?",
            options: [
                "a. <ul>",
                "b. <dl>",
                "c. <ol>",
                "d. <list>"
            ],
            answer: "c. <ol>"
        },
        {
            question: "Which attribute is used to provide an alternative text for an image?",
            options: [
                "a. alt",
                "b. src",
                "c. title",
                "d. href"
            ],
            answer: "a. alt"
        },
        {
            question: "What is the correct HTML element for inserting a line break?",
            options: [
                "a. <break>",
                "b. <lb>",
                "c. <br>",
                "d. <hr>"
            ],
            answer: "c. <br>"
        },
        {
            question: "Which HTML element defines the navigation links?",
            options: [
                "a. <nav>",
                "b. <navs>",
                "c. <navigate>",
                "d. <navig>"
            ],
            answer: "a. <nav>"
        },
        {
            question: "How can you create an email link in HTML?",
            options: [
                "a. <a href='mailto:someone@example.com'>Email</a>",
                "b. <a href='email:someone@example.com'>Email</a>",
                "c. <mail href='someone@example.com'>Email</mail>",
                "d. <email>someone@example.com</email>"
            ],
            answer: "a. <a href='mailto:someone@example.com'>Email</a>"
        },
        {
            question: "Which HTML element is used to specify a footer for a document or section?",
            options: [
                "a. <bottom>",
                "b. <foot>",
                "c. <footer>",
                "d. <section>"
            ],
            answer: "c. <footer>"
        },
        {
            question: "What is the correct HTML for making a checkbox?",
            options: [
                "a. <checkbox>",
                "b. <input type='checkbox'>",
                "c. <check>",
                "d. <input type='check'>"
            ],
            answer: "b. <input type='checkbox'>"
        },
        {
            question: "How do you insert a comment in HTML?",
            options: [
                "a. <!-- This is a comment -->",
                "b. // This is a comment",
                "c. /* This is a comment */",
                "d. <comment> This is a comment </comment>"
            ],
            answer: "a. <!-- This is a comment -->"
        },
        {
            question: "What does CSS stand for?",
            options: [
                "a. Creative Style Sheets",
                "b. Cascading Style Sheets",
                "c. Colorful Style Sheets",
                "d. Computer Style Sheets"
            ],
            answer: "b. Cascading Style Sheets"
        },
        {
            question: "Where in an HTML document is the correct place to refer to an external style sheet?",
            options: [
                "a. At the end of the document",
                "b. In the <head> section",
                "c. In the <body> section",
                "d. At the beginning of the document"
            ],
            answer: "b. In the <head> section"
        },
        {
            question: "Which HTML attribute is used to define inline styles?",
            options: [
                "a. style",
                "b. class",
                "c. font",
                "d. styles"
            ],
            answer: "a. style"
        },
        {
            question: "Which is the correct CSS syntax?",
            options: [
                "a. {body;color:black;}",
                "b. body:color=black;",
                "c. body {color: black;}",
                "d. {body:color=black;}"
            ],
            answer: "c. body {color: black;}"
        },
        {
            question: "How do you add a background color for all <h1> elements?",
            options: [
                "a. all.h1 {background-color: #FFFFFF;}",
                "b. h1.all {background-color: #FFFFFF;}",
                "c. h1 {background-color: #FFFFFF;}",
                "d. all-h1 {background-color: #FFFFFF;}"
            ],
            answer: "c. h1 {background-color: #FFFFFF;}"
        },
        {
            question: "Which property is used to change the left margin of an element?",
            options: [
                "a. padding-left",
                "b. margin-left",
                "c. indent-left",
                "d. space-left",
            ],
            correct: "b. margin-left"
        }
    ];

    // Pang check lang kung ilan yung sinelect ni user na question
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedOption = document.querySelector('input[name="questionCount"]:checked');
        if (selectedOption) {
            selectedQuestionCount = parseInt(selectedOption.value);
            resetQuiz();
            loadQuestions(selectedQuestionCount);
            quizForm.style.display = 'none';
            quizContainer.style.display = 'block';
            quizGameCount.style.display = 'none';
            displayQuestion(selectedQuestions[currentQuestionIndex]);
            startTimer();
            updateTimerDisplay();
        } else {
            Swal.fire('Please select the number of questions.');
        }
    });

    nextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector(`input[name="question_${currentQuestionIndex}"]:checked`);
        if (!selectedOption) {
            Swal.fire('Please select an answer before proceeding.');
            return;
        }

        userAnswers[currentQuestionIndex] = selectedOption.value;
        currentQuestionIndex++;

        if (currentQuestionIndex < selectedQuestionCount) {
            displayQuestion(selectedQuestions[currentQuestionIndex]);
        } else {
            showResults();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(selectedQuestions[currentQuestionIndex]);
        }
    });

    function resetQuiz() {
        correctAnswers = 0;
        currentQuestionIndex = 0;
        userAnswers = {};
        clearInterval(timerInterval);
        timeLeft = 300;
        updateTimerDisplay();
        prevButton.style.display = 'none';
        nextButton.style.display = 'inline-block';
    }

    function loadQuestions(count) {
        selectedQuestions = questions.slice(0, count);
    }

    function displayQuestion(question) {
        questionsDiv.innerHTML = '';
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionNumber = document.createElement('h3');
        questionNumber.textContent = `Question ${currentQuestionIndex + 1}:`;
        questionElement.appendChild(questionNumber);

        const questionText = document.createElement('h4');
        questionText.textContent = question.question;
        questionText.style.fontSize = '20px';
        questionElement.appendChild(questionText);

        const options = question.options.slice();
        options.forEach((option, i) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${currentQuestionIndex}`;
            input.id = `option_${currentQuestionIndex}_${i}`;
            input.value = option;

            const label = document.createElement('label');
            label.textContent = option;
            label.setAttribute('for', `option_${currentQuestionIndex}_${i}`);
            label.classList.add('option-button');

            label.addEventListener('click', () => {
                const allOptionButtons = questionsDiv.querySelectorAll('.option-button');
                allOptionButtons.forEach(btn => btn.classList.remove('clicked'));
                label.classList.add('clicked');
            });

            questionElement.appendChild(input);
            questionElement.appendChild(label);
        });

        questionsDiv.appendChild(questionElement);

        prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
        nextButton.style.display = 'inline-block';
    }

    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                Swal.fire('Time is up!');
                showResults();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function showResults() {
        correctAnswers = selectedQuestions.reduce((score, question, index) => {
            return userAnswers[index] === question.answer ? score + 1 : score;
        }, 0);

        Swal.fire(`Your score: ${correctAnswers} out of ${selectedQuestionCount}`);
        saveScore(correctAnswers);
        resetQuiz();
        quizForm.style.display = 'block';
        quizContainer.style.display = 'none';
        quizGameCount.style.display = 'block';
        displayStoredScores();
    }

    function saveScore(score) {
        let scores = JSON.parse(localStorage.getItem('quizScores')) || [];
        scores.push(score);
        localStorage.setItem('quizScores', JSON.stringify(scores));
    }

    function displayStoredScores() {
        let scores = JSON.parse(localStorage.getItem('quizScores')) || [];
        scoreDisplay.innerHTML = 'Stored Scores: ' + scores.join(', ');
    }

    displayStoredScores();

});