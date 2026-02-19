const timeSelect = document.getElementById("timeSelect");
const startBtn = document.getElementById("startTest");
const timerDisplay = document.getElementById("timerDisplay");
const wpmDisplay = document.getElementById("wpmDisplay");
const mistakeDisplay = document.getElementById("mistakeDisplay");
const textDisplay = document.getElementById("textDisplay");
const hiddenInput = document.getElementById("hiddenInput");

let timer;
let maxTime = 30;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let allWords = [];

async function initApp() {
    try {
        const response = await fetch('assets/data/words.json');
        const allWord = await response.json();
        allWords = allWord;
        
        maxTime = parseInt(timeSelect.value);
        timeLeft = maxTime;
        timerDisplay.innerText = timeLeft;
        
        renderText();
    } catch (error) {
        console.log("Error: ", error);
    }
}

function renderText() {
    textDisplay.scrollTo(0, 0);
    textDisplay.innerHTML = "";

    const randomIndex = Math.floor(Math.random() * allWords.length);
    const selectedText = allWords[randomIndex].text;

    selectedText.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.classList.add("char"); 
        span.innerText = char;   
        if (index === 0) span.classList.add("current");
        textDisplay.appendChild(span);
    });

    charIndex = 0; 
    hiddenInput.value = "";
    hiddenInput.focus();
}

hiddenInput.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
        const charSpans = textDisplay.querySelectorAll(".char");
        if (charIndex > 0) {
            charIndex--;
            if (charSpans[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            charSpans[charIndex].classList.remove("correct", "incorrect", "current");
            
            charSpans.forEach(s => s.classList.remove("current"));
            charSpans[charIndex].classList.add("current");
            mistakeDisplay.innerText = mistakes;
        }
    }
});

hiddenInput.addEventListener("input", (e) => {
    const charSpans = textDisplay.querySelectorAll(".char");
    let userChar = e.data; 

    if (userChar == null && e.inputType === "deleteContentBackward") return;

    if (!isTyping && timeLeft > 0) {
        timer = setInterval(startTimer, 1000); 
        isTyping = true;
    }

    if (charIndex < charSpans.length) {
        if (charSpans[charIndex].innerText === userChar) {
            charSpans[charIndex].classList.add("correct");
        } else {
            charSpans[charIndex].classList.add("incorrect");
            mistakes++; 
        }
        
        charIndex++; 

        charSpans.forEach(span => span.classList.remove("current"));
        if (charIndex < charSpans.length) {
            charSpans[charIndex].classList.add("current");
            
            charSpans[charIndex].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    if (charIndex === charSpans.length) {
        renderText();
    }   

    mistakeDisplay.innerText = mistakes;
    hiddenInput.value = ""; 
});

function startTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        let timePassed = maxTime - timeLeft;
        let netChar = Math.max(0, charIndex - mistakes);
        let wpm = Math.round((netChar / 5) / (timePassed / 60));
        wpmDisplay.innerText = (wpm > 0 && wpm < 250) ? wpm : 0;
    } else {
        clearInterval(timer);
        isTyping = false;
        finishTest();
    }
}

function finishTest() {
    hiddenInput.disabled = true; 
    const finalWpm = wpmDisplay.innerText;
    const finalMistakes = mistakeDisplay.innerText;
    let accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;

    alert(`Oyun Bitti! \nHızın: ${finalWpm} WPM \nDoğruluk: %${accuracy} \nToplam Hata: ${finalMistakes}`);
}

function resetTest() {
    textDisplay.scrollTo(0, 0);
    hiddenInput.disabled = false;
    clearInterval(timer);
    maxTime = parseInt(timeSelect.value);
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    
    timerDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    mistakeDisplay.innerText = 0;
    hiddenInput.value = "";
    renderText();
}

startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetTest();
    hiddenInput.focus(); 
});

timeSelect.addEventListener("change", () => {
    resetTest(); 
});

initApp();