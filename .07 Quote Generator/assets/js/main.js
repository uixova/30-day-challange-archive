const quoteText = document.getElementById("generated-text");
const generateBtn = document.querySelector(".generate-btn");
const copyBtn = document.querySelector(".copy-btn");

let allQuotes = [];

async function loadQuotes() {
    try {
        const response = await fetch('assets/data/quotes.json');
        allQuotes = await response.json();
        getQuote();
    } catch (error) {
        console.log("Veri çekilirken hata oluştu:", error);
        quoteText.innerHTML = "Sözler yüklenemedi. :(";
    };
};

const getQuote = () => {
    if (allQuotes === 0) return;

    quoteText.style.opacity = 0;

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        const randomQuote = allQuotes[randomIndex];

        quoteText.innerHTML = `"${randomQuote.text}" <br> <br> <small>- ${randomQuote.author}</small>`;
        quoteText.style.opacity = 1;
    }, 200);
};

copyBtn.addEventListener("click", () => {
    const text = quoteText.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalIcon = copyBtn.innerHTML; 
        copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
        }, 2000);
    })
})

generateBtn.addEventListener("click", getQuote);

loadQuotes();