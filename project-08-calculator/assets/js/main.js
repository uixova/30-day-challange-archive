const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
const historyDisplay = document.getElementById('history');

let currentInput = "";
let isCalculated = false;

function appendNumber(num) {
    if (num === '.' && currentInput.includes('.')) return;

    if (isCalculated) {
        currentInput = num;
        isCalculated = false;
    } else {
        if (currentInput === "0" && num !== ".") {
            currentInput = num;
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendOperator(opValue) {
    if (currentInput === "") return;

    isCalculated = false;
    
    const op = (opValue === 'x') ? '*' : opValue;
    const lastChar = currentInput.slice(-1);

    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }
    updateDisplay();
}

function calculate() {
    try {
        if (currentInput === "" || isCalculated) return;

        historyDisplay.innerText = currentInput.replace(/\*/g, 'x') + " =";

        let result = eval(currentInput);
        
        currentInput = parseFloat(result.toFixed(5)).toString();
        
        isCalculated = true;
        updateDisplay();
    } catch (error) {
        display.value = "Hata";
        currentInput = "";
        historyDisplay.innerText = "";
    }
}
function clearDisplay() {
    currentInput = "";
    historyDisplay.innerText = ""; 
    isCalculated = false;
    display.value = "0";
}

function deleteLast() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput === "" ? "0" : currentInput;
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.getAttribute('value');
        const type = btn.getAttribute('data-type');
        
        if (type === 'number' || type === 'decimal') {
            appendNumber(value);
        } else if (type === 'clear') {
            clearDisplay()
        } else if (type === 'backspace') {
            deleteLast()
        } else if (type === 'operator') {
            if (value === '%') {
                try {
                    currentInput = (eval(currentInput) / 100).toString();
                    updateDisplay();
                } catch { currentInput = "Hata";}
            } else {
                appendOperator(value);
            }
        } else if (type === 'equals') {
            calculate()
        };
    });
});

document.addEventListener("keydown", (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    };

    if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key === '*' ? 'x' : e.key);
    };

    if (e.key === 'Enter') {
        calculate();
    }

    if (e.key === 'Escape') {
        clearDisplay();
    }

    if (e.key === 'Backspace') {
        deleteLast();
    }
});

window.onload = () => {
    clearDisplay();
};