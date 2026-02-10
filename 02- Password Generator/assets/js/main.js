const output = document.getElementById("output");
const slider = document.getElementById("length-slider");
const lengthVal = document.getElementById("length-val");
const generateBtn = document.querySelector(".generate-btn");
const copyBtn = document.querySelector(".copy-btn");

const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");

const charSets = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
    symbol: "!@#$%^&*()_+~`|}{[]:;?><,./-="
};

slider.addEventListener("input", () => {
    lengthVal.textContent = slider.value;
});

function generatePassword() {
    let charPool = "";
    let generatedPassword = "";

    if (uppercaseEl.checked) charPool += charSets.upper;
    if (lowercaseEl.checked) charPool += charSets.lower;
    if (numbersEl.checked) charPool += charSets.number;
    if (symbolsEl.checked) charPool += charSets.symbol;

    if (charPool === "") {
        alert("Lütfen En az bir seçeneği seçiniz!")
        return "";
    };

    for (let i = 0; i < slider.value; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        generatedPassword += charPool[randomIndex];
    }

    return generatedPassword;
}

generateBtn.addEventListener("click", () => {
    output.textContent = generatePassword();
    document.querySelector('.password-output').scrollLeft = 0;
})

copyBtn.addEventListener("click", () => {
    const password = output.textContent;
    if (!password || password === "P4ssw0rd!") return;

    navigator.clipboard.writeText(password).then(() =>{
        const toolTip = document.querySelector(".tooltiptext");
        const icon = copyBtn.querySelector("i");
        toolTip.style.left = "60px";
        toolTip.style.width = "60px";
        toolTip.textContent = "Copied!";
        icon.classList.replace('bi-clipboard', 'bi-clipboard-check');
        setTimeout(() => { 
            toolTip.textContent = "Copy"; 
            icon.classList.replace('bi-clipboard-check', 'bi-clipboard');
        }, 2000);
    });
})



// output içerisindeki scroll barı kaldırıldı yerine mause hareketi eklendi 
const outputContainer = document.getElementById('output');
outputContainer.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    outputContainer.scrollLeft += evt.deltaY;
});
