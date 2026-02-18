const expenseCards = document.getElementById("expenseCards");
const dateHistoryList = document.getElementById("dateHistoryList");
const selectedDateLabel = document.getElementById("selectedDateLabel");

const transactionType = document.getElementById("transactionType");
const expenseTitle = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");

let allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentSelectedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function initApp() {
    clearOldRecords(); 
    selectedDateLabel.innerText = currentSelectedDate;
    renderTransactions();
    renderHistory();
    updateGeneralStats();
}

function clearOldRecords() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    allTransactions = allTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= thirtyDaysAgo;
    });
    saveToLocalStorage();
}

function addNewTransaction() {
    const title = expenseTitle.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const type = transactionType.value;
    const category = expenseCategory.value;

    if(!title || isNaN(amount)) {
        alert("Please fill in the blank fields!");
        return;
    }

    const newTransaction = {
        id: Date.now(),
        title: title,
        amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
        category: category,
        date: currentSelectedDate
    };

    allTransactions.push(newTransaction);
    saveToLocalStorage();

    expenseTitle.value = "";
    expenseAmount.value = "";

    renderTransactions();
    updateGeneralStats();
    renderHistory();
}

function renderTransactions(){
    const filtered = allTransactions.filter(item => item.date === currentSelectedDate);

    const htmlContent = filtered.map(item => {
        const isNegative = item.amount < 0;
        const statusClass = isNegative ? "negative" : "positive";
        const sign = isNegative ? "" : "+";

        return `
            <div class="expense-item-card">
                <div class="item-info">
                    <span class="category-tag">${item.category}</span>
                    <p>${item.title}</p>
                </div>
                <div class="item-right">
                    <span class="item-value ${statusClass}">
                        ${sign}$${Math.abs(item.amount).toLocaleString()}
                    </span>
                    <button class="delete-btn" onclick="deleteTransaction(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
    
    expenseCards.innerHTML = htmlContent;
}

function updateGeneralStats() {
    const dailyTransactions = allTransactions.filter(t => t.date === currentSelectedDate);

    const dailyIncome = dailyTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const dailyExpense = dailyTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);

    document.querySelector(".daily-stats-row .income-val").innerText = `$${dailyIncome.toLocaleString()}`;
    document.querySelector(".daily-stats-row .expense-val").innerText = `$${Math.abs(dailyExpense).toLocaleString()}`;

    const totalIncome = allTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = allTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome + totalExpense; 

    const footerCards = document.querySelectorAll(".footer-bottom-panel .value");
    if(footerCards.length >= 3) {
        footerCards[0].innerText = `$${totalIncome.toLocaleString()}`;
        footerCards[1].innerText = `$${Math.abs(totalExpense).toLocaleString()}`;
        footerCards[2].innerText = `$${netBalance.toLocaleString()}`;
        footerCards[2].style.color = netBalance < 0 ? "#ef4444" : "#10b981";
    }
}

function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(allTransactions));
}

function deleteTransaction(id) {
    allTransactions = allTransactions.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTransactions();
    updateGeneralStats();
    renderHistory(); 
}

function renderHistory() {
    const historyContainer = document.getElementById("dateHistoryList");
    if(!historyContainer) return;
    historyContainer.innerHTML = "";

    const dates = [...new Set(allTransactions.map(t => t.date))].sort((a, b) => new Date(b) - new Date(a));

    dates.forEach(date => {
        const dateItem = document.createElement("div");
        dateItem.className = `date-item ${date === currentSelectedDate ? 'active' : ''}`;
        
        dateItem.innerHTML = `
            <span onclick="changeDate('${date}')">${date}</span>
            <button class="date-delete-btn" onclick="deleteDateGroup('${date}')">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        historyContainer.appendChild(dateItem);
    });
}

function changeDate(date) {
    currentSelectedDate = date;
    selectedDateLabel.innerText = currentSelectedDate;
    renderTransactions();
    updateGeneralStats();
    renderHistory(); 
}

function deleteDateGroup(date) {
    if(confirm(`Delete all records for ${date}?`)) {
        allTransactions = allTransactions.filter(t => t.date !== date);
        saveToLocalStorage();
        
        if(currentSelectedDate === date) {
            currentSelectedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        
        initApp();
    }
}

initApp();