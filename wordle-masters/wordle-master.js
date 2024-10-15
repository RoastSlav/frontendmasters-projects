const letters = document.querySelectorAll(".letterboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
    let isLoading = true;
    setLoading(true);
    let currentGuess = '';
    let currentRow = 0;
    
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = "IVORY"//resObj.word.toUpperCase();
    const wordParts = word.split("");
    let done = false;
    setLoading(false);
    isLoading = false;

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerHTML = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            return;
        }

        isLoading = true;
        setLoading(true);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({word: currentGuess})
        });

        const resObj = await res.json();
        const validWord = resObj.validWord;

        isLoading = false;
        setLoading(false);

        if (!validWord) {
            markInvalidWord();
            return;
        }

        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);


        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                map[guessParts[i]]--;
                console.log("removing letter from map " + map[guessParts[i]]);
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                //do nothing
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
                map[guessParts[i]]--;
            } else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
            }
        }

        currentRow++;
        if (currentGuess == word) {
            alert("You Win!");
            document.querySelector(".brand").classList.add("winner");
            done = true;
            return;
        } else if (currentRow === ROUNDS) {
            alert("You lose! The word was " + word);
        }
        currentGuess = '';
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerHTML = "";
    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

            setTimeout(function () {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
            }, 10);
        }
    }

    document.addEventListener("keydown", function handleKeyPress (event) {
        if (done || isLoading) {
            return;
        } 

        const action = event.key;

        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase())
        }
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle('show', isLoading);
}

function makeMap (array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    } 
    return obj;
}

init();