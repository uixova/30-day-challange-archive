const gameContainer = document.querySelector(".container"),
    userResult = document.querySelector(".user-result img"),
    botResult = document.querySelector(".bot-result img"),
    resultText = document.querySelector(".result"),
    optionImages = document.querySelectorAll(".option-image"),
    youScoreElement = document.querySelector(".you-score"),
    botScoreElement = document.querySelector(".bot-score"),
    historyList = document.querySelector(".history-list");

let userScore = 0;
let botScore = 0;

const cpuImages = ["assets/images/rock.png", "assets/images/paper.png", "assets/images/scissors.png"];

const outcomes = {
    RR: "Draw", RP: "Bot", RS: "You",
    PP: "Draw", PR: "You", PS: "Bot",
    SS: "Draw", SR: "Bot", SP: "You"
};

optionImages.forEach((image, index) => {
    image.addEventListener("click", (e) => {
        image.classList.add("active");

        optionImages.forEach((image2, index2) => {
            index !== index2 && image2.classList.remove("active");
        });

        gameContainer.classList.add("start");

        userResult.src = botResult.src = "assets/images/rock.png";
        resultText.innerText = "Wait...";

        setTimeout(() => {
            gameContainer.classList.remove("start");

            let imageSrc = image.querySelector("img").src;
            userResult.src = imageSrc;

            let randomNumber = Math.floor(Math.random() * 3);
            botResult.src = cpuImages[randomNumber];

            let userValue = ["R", "P", "S"][index];
            let botValue = ["R", "P", "S"][randomNumber];

            let outComeValue = outcomes[userValue + botValue];

            if (userValue === botValue) {
                resultText.innerText = "Match Draw";
            } else {
                resultText.innerText = `${outComeValue} Won!!`;
                if (outComeValue === "You") userScore++;
                else botScore++;
            }

            updateUI();
        }, 2500);
    });
});

function updateUI() {
    youScoreElement.innerText = userScore;
    botScoreElement.innerText = botScore;

    const historyItem = document.createElement("div");
    historyItem.className = "score-history-item";

    const userClass = userScore > botScore ? "win" : (userScore < botScore ? "lose" : "");
    const botClass = botScore > userScore ? "win" : (botScore < userScore ? "lose" : "");

    historyItem.innerHTML = `
        <span class="history-val ${userClass}">${userScore}</span>
        <span class="history-divider">-</span>
        <span class="history-val ${botClass}">${botScore}</span>
    `;

    historyList.prepend(historyItem);
}