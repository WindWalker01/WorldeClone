let numLetters = 0;
let attempts = 0;
let currentGuess = "";
const MAX_CHAR = 5;
let answer = "";
const row = document.querySelectorAll(".guess-row");
init();
async function init() {
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resobj = await res.json();
    answer = resobj.word.toUpperCase();
    console.log(answer);
    document.addEventListener("keydown", function(event) {
        if (isLetter(event.key)) addLetter(event.key);
        else if (event.key === "Backspace") removeLetter();
        else if (event.key === "Enter") commitGuess();
    });
}
async function commitGuess() {
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({
            word: currentGuess
        })
    });
    const resObj = await res.json();
    const { validWord } = resObj;
    if (!validWord) {
        alert("Not a valid word dumbass!");
        return;
    }
    const answerChars = answer.split("");
    const guessChars = currentGuess.split("");
    const answerObj = makeMap(answerChars);
    if (currentGuess.length < 5) return;
    for(let i = 0; i < MAX_CHAR; i++)if (answerChars[i] === guessChars[i]) {
        row[attempts].children[i].classList.add("correct");
        answerObj[guessChars[i]]--;
    }
    for(let i = 0; i < MAX_CHAR; i++){
        if (answerChars[i] === guessChars[i]) continue;
        else if (answerChars.includes(guessChars[i]) && answerObj[guessChars[i]] > 0) {
            row[attempts].children[i].classList.add("partial");
            answerObj[guessChars[i]]--;
        } else row[attempts].children[i].classList.add("wrong");
    }
    if (currentGuess === answer) alert("You win!");
    else if (attempts >= 5) alert("You lose!");
    else {
        attempts++;
        currentGuess = "";
    }
}
function addLetter(letter) {
    if (currentGuess.length < MAX_CHAR) {
        row[attempts].children[currentGuess.length].innerHTML = letter.toUpperCase();
        currentGuess += letter.toUpperCase();
    }
}
function removeLetter() {
    if (currentGuess.length > 0) {
        row[attempts].children[currentGuess.length - 1].innerHTML = "";
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    }
}
function makeMap(array) {
    const obj = {};
    for(let i = 0; i < array.length; i++){
        const letter = array[i];
        if (obj[letter]) obj[letter]--;
        else obj[letter] = 1;
    }
    return obj;
}
function isLetter(value) {
    return /^[a-zA-Z]$/.test(value);
}

//# sourceMappingURL=index.7c0ccee6.js.map
