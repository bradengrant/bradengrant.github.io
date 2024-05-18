const words = ['apple', 'brick', 'crane', 'dried', 'eagle'];
const targetWord = words[Math.floor(Math.random() * words.length)];
let currentGuess = '';
let attempts = 0;
const maxAttempts = 6;

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');

function createBoard() {
    for (let i = 0; i < maxAttempts * 5; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        board.appendChild(cell);
    }
}

function createKeyboard() {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    keys.push('ENTER', 'BACKSPACE');

    keys.forEach(key => {
        const keyButton = document.createElement('div');
        keyButton.className = 'key';
        keyButton.innerText = key;
        keyButton.onclick = () => handleKeyPress(key);
        keyboard.appendChild(keyButton);
    });
}

function handleKeyPress(key) {
    if (key === 'ENTER') {
        if (currentGuess.length === 5) {
            checkGuess();
        }
    } else if (key === 'BACKSPACE') {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (currentGuess.length < 5) {
        currentGuess += key.toLowerCase();
        updateBoard();
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    const start = attempts * 5;
    for (let i = 0; i < 5; i++) {
        cells[start + i].innerText = currentGuess[i] || '';
    }
}

function checkGuess() {
    const cells = document.querySelectorAll('.cell');
    const start = attempts * 5;

    if (currentGuess === targetWord) {
        for (let i = 0; i < 5; i++) {
            cells[start + i].classList.add('correct');
        }
        message.innerText = 'You Win!';
        return;
    }

    const letterCount = {};
    for (let letter of targetWord) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
        if (currentGuess[i] === targetWord[i]) {
            cells[start + i].classList.add('correct');
            letterCount[currentGuess[i]]--;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (!cells[start + i].classList.contains('correct')) {
            if (letterCount[currentGuess[i]]) {
                cells[start + i].classList.add('present');
                letterCount[currentGuess[i]]--;
            } else {
                cells[start + i].classList.add('absent');
            }
        }
    }

    attempts++;
    currentGuess = '';
    if (attempts === maxAttempts) {
        message.innerText = `Game Over! The word was: ${targetWord}`;
    }
}

createBoard();
createKeyboard();
