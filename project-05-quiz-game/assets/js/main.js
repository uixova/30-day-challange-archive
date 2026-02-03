let allQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let systemQuizzes = []; 
let currentQuiz = { id: Date.now(), title: "Yeni Test 1", duration: 60, questions: [] };
let currentQuestionIndex = 0;
let selectedCorrectAnswer = "a";

let gameState = {
    activeQuiz: null,
    currentIdx: 0,
    corrects: 0,
    wrongs: 0,
    empties: 0,
    timeLeft: 0,
    timerInterval: null
};

// --- SAYFA YÖNETİMİ ---
function showSection(sectionId) {
    document.querySelectorAll('.main-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';
    
    if (sectionId === 'quiz') {
        renderQuizListPage();
        loadSystemQuizzes(); 
    }
    if (sectionId === 'create') {
        document.getElementById('display-test-title').textContent = currentQuiz.title;
        renderSavedQuestionsSidebar();
        loadQuestionToEditor(currentQuestionIndex);
    }
}

// --- JSON'DAN HAZIR TESTLERİ ÇEKME ---
async function loadSystemQuizzes() {
    try {
        const response = await fetch('assets/data/quiz.json'); 
        if (response.ok) {
            systemQuizzes = await response.json();
            renderSystemQuizzes();
        }
    } catch (err) {
        console.log("Hazır testler yüklenemedi:", err);
    }
}

function renderSystemQuizzes() {
    const container = document.getElementById('json-quizzes');
    if (!container) return;
    
    container.innerHTML = systemQuizzes.map((quiz, index) => `
        <div class="quiz-box">
            <div class="quiz-box-left">
                <h1>${quiz.title}</h1>
            </div>
            <div class="quiz-test-right">
                <button class="quiz-play play-btn" onclick="startSystemQuiz(${index})">
                    <i class="bi bi-play-fill"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// --- TEST OLUŞTURMA VE EDİTÖR ---
function changeQuizTitle() {
    const newTitle = prompt("Test Başlığı:", currentQuiz.title);
    if (newTitle) {
        currentQuiz.title = newTitle;
        document.getElementById('display-test-title').textContent = newTitle;
    }
}

// Doğru Şık Seçimi
document.querySelectorAll('.opt-label').forEach(label => {
    label.addEventListener('click', function() {
        document.querySelectorAll('.opt-label').forEach(l => {
            l.style.backgroundColor = 'white';
            l.style.color = 'black';
        });
        this.style.backgroundColor = '#222';
        this.style.color = 'white';
        selectedCorrectAnswer = this.textContent.trim().toLowerCase();
    });
});

function saveQuestionToMemory() {
    const qText = document.getElementById('question-text').value.trim();
    const a = document.getElementById('input-a').value.trim();
    const b = document.getElementById('input-b').value.trim();
    const c = document.getElementById('input-c').value.trim();
    const d = document.getElementById('input-d').value.trim();

    if (!qText || !a || !b || !c || !d) {
        return false;
    }

    const questionObj = { 
        text: qText, 
        options: { a, b, c, d }, 
        correct: selectedCorrectAnswer 
    };

    currentQuiz.questions[currentQuestionIndex] = questionObj;
    renderSavedQuestionsSidebar();
    return true;
}

function loadQuestionToEditor(index) {
    currentQuestionIndex = index;
    const q = currentQuiz.questions[index];
    
    if (q) {
        document.getElementById('question-text').value = q.text;
        document.getElementById('input-a').value = q.options.a;
        document.getElementById('input-b').value = q.options.b;
        document.getElementById('input-c').value = q.options.c;
        document.getElementById('input-d').value = q.options.d;
        updateLabelUI(q.correct);
        selectedCorrectAnswer = q.correct;
    } else {
        clearEditor();
    }
    document.getElementById('current-question-count').textContent = `${currentQuestionIndex + 1}/${Math.max(currentQuiz.questions.length, currentQuestionIndex + 1)}`;
}

function updateLabelUI(correctLetter) {
    document.querySelectorAll('.opt-label').forEach(l => {
        if(l.textContent.toLowerCase() === correctLetter) {
            l.style.backgroundColor = '#222'; l.style.color = 'white';
        } else {
            l.style.backgroundColor = 'white'; l.style.color = 'black';
        }
    });
}

function clearEditor() {
    document.getElementById('question-text').value = "";
    document.getElementById('input-a').value = "";
    document.getElementById('input-b').value = "";
    document.getElementById('input-c').value = "";
    document.getElementById('input-d').value = "";
    updateLabelUI("a");
    selectedCorrectAnswer = "a";
}

function renderSavedQuestionsSidebar() {
    const list = document.getElementById('saved-questions-list');
    list.innerHTML = currentQuiz.questions.map((q, i) => `
        <div class="test-item-card" onclick="loadQuestionToEditor(${i})">
            <span>Soru ${i + 1}</span>
            <button onclick="event.stopPropagation(); deleteSingleQuestion(${i})"><i class="bi bi-trash"></i></button>
        </div>
    `).join('');
}

function deleteSingleQuestion(i) {
    currentQuiz.questions.splice(i, 1);
    currentQuestionIndex = Math.max(0, currentQuiz.questions.length - 1);
    renderSavedQuestionsSidebar();
    loadQuestionToEditor(currentQuestionIndex);
}

document.querySelectorAll('.quiz-option-btn input').forEach(input => {
    input.addEventListener('focus', function() {
        const label = this.parentElement.querySelector('.opt-label');
        label.click(); 
    });
});

// --- KAYDETME ---
document.getElementById('btn-save-quiz').addEventListener('click', () => {
    saveQuestionToMemory();
    if (currentQuiz.questions.length === 0) return alert("En az 1 soru eklemelisiniz!");

    currentQuiz.duration = document.getElementById('test-duration').value || 60;
    
    const existingIndex = allQuizzes.findIndex(q => q.id === currentQuiz.id);
    if (existingIndex > -1) allQuizzes[existingIndex] = JSON.parse(JSON.stringify(currentQuiz));
    else allQuizzes.push(JSON.parse(JSON.stringify(currentQuiz)));

    localStorage.setItem('quizzes', JSON.stringify(allQuizzes));
    alert("Test Kaydedildi!");
    currentQuiz = { id: Date.now(), title: "Yeni Test " + (allQuizzes.length + 1), duration: 60, questions: [] };
    showSection('quiz');
});

// --- Quiz SİSTEMİ ---
function renderQuizListPage() {
    const container = document.getElementById('user-quizzes');
    if (!container) return;
    
    container.innerHTML = allQuizzes.map((quiz, index) => `
        <div class="quiz-box">
            <div class="quiz-box-left">
                <h1>${quiz.title}</h1>
            </div>
            <div class="quiz-test-right">
                <button class="quiz-edit" onclick="editQuiz(${index})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="quiz-delete" onclick="deleteQuiz(${index})">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="quiz-play play-btn" onclick="startQuiz(${index})">
                    <i class="bi bi-play-fill"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function startQuiz(index) {
    const quiz = allQuizzes[index];
    gameState = {
        activeQuiz: quiz, currentIdx: 0, corrects: 0, wrongs: 0, empties: 0,
        timeLeft: parseInt(quiz.duration), timerInterval: null
    };
    showSection('game-play');
    loadGameQuestion();
    startTimer();
}

function startSystemQuiz(index) {
    const quiz = systemQuizzes[index];
    gameState = {
        activeQuiz: quiz, currentIdx: 0, corrects: 0, wrongs: 0, empties: 0,
        timeLeft: parseInt(quiz.duration), timerInterval: null
    };
    showSection('game-play');
    loadGameQuestion();
    startTimer();
}

function startTimer() {
    if(gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('game-timer').textContent = gameState.timeLeft;
        if (gameState.timeLeft <= 0) endGames();
    }, 1000);
}

function loadGameQuestion() {
    const q = gameState.activeQuiz.questions[gameState.currentIdx];
    const total = gameState.activeQuiz.questions.length;
    
    document.getElementById('game-title').textContent = gameState.activeQuiz.title;
    document.getElementById('game-question-text').textContent = q.text;
    document.getElementById('game-opt-a').textContent = q.options.a;
    document.getElementById('game-opt-b').textContent = q.options.b;
    document.getElementById('game-opt-c').textContent = q.options.c;
    document.getElementById('game-opt-d').textContent = q.options.d;
    document.getElementById('game-progress').textContent = `${gameState.currentIdx + 1}/${total}`;
    document.getElementById('progress-bar-fill').style.width = `${((gameState.currentIdx + 1) / total) * 100}%`;
}

let canClick = true;

function checkAnswer(choice) {
    if (!canClick) return;

    canClick = false;

    const q = gameState.activeQuiz.questions[gameState.currentIdx];
    const selectedBtn = document.querySelector(`.btn-${choice}`)
    if (choice === q.correct) {
        gameState.corrects++;
        selectedBtn.style.backgroundColor = "#14de2c";
    }else {
        gameState.wrongs++;
        selectedBtn.style.backgroundColor = "#c92424";
        document.querySelector(`.btn-${q.correct}`).style.backgroundColor = "#14de2c";
    }

    setTimeout(() => {
       document.querySelectorAll(".modern-opt-btn").forEach(btn => {
        btn.style.backgroundColor = "";
       });

       canClick = true;

       gameState.currentIdx++;
       if (gameState.currentIdx < gameState.activeQuiz.questions.length) {
        loadGameQuestion();
       }else {
        endGames();}
    }, 500); 
}

function endGames() {
    clearInterval(gameState.timerInterval);
    showSection('result-screen');
    const total = gameState.activeQuiz.questions.length;
    gameState.empties = total - (gameState.corrects + gameState.wrongs);
    
    document.getElementById('res-score').textContent = gameState.corrects * 10;
    document.getElementById('res-correct').textContent = gameState.corrects;
    document.getElementById('res-wrong').textContent = gameState.wrongs;
    document.getElementById('res-empty').textContent = gameState.empties;
    
    saveToHistory(gameState.activeQuiz.title, gameState.corrects * 10);
}

// --- YARDIMCI BUTONLAR VE EVENTLER ---
document.getElementById('btn-next').onclick = () => {
    if (saveQuestionToMemory()) {
        currentQuestionIndex++;
        loadQuestionToEditor(currentQuestionIndex);
    } else {
        alert("Lütfen tüm alanları doldurun!");
    }
};

document.getElementById('btn-prev').onclick = () => {
    saveQuestionToMemory();
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestionToEditor(currentQuestionIndex);
    }
};

document.getElementById('btn-delete-all').onclick = () => {
    if(confirm("Tüm soruları silmek istiyor musun?")) {
        currentQuiz.questions = [];
        currentQuestionIndex = 0;
        renderSavedQuestionsSidebar();
        clearEditor();
    }
};

// Navbar ve History Butonları
document.querySelectorAll('.history-toggle-btn').forEach(btn => {
    btn.onclick = toggleHistory;
});

function deleteQuiz(index) {
    if(confirm("Silmek istediğine emin misin?")) {
        allQuizzes.splice(index, 1);
        localStorage.setItem('quizzes', JSON.stringify(allQuizzes));
        renderQuizListPage();
    }
}

function editQuiz(index) {
    currentQuiz = JSON.parse(JSON.stringify(allQuizzes[index]));
    showSection('create');
}

// --- GEÇMİŞ ---
function toggleHistory() {
    const sidebar = document.getElementById('side-history');
    sidebar.classList.toggle('active');
    if(sidebar.classList.contains('active')) renderHistory();
}

function saveToHistory(title, score) {
    let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
    history.unshift({ title, score, date: new Date().toLocaleDateString() });
    localStorage.setItem('quizHistory', JSON.stringify(history));
}

function renderHistory() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
    list.innerHTML = history.length ? history.map(h => `
        <div class="history-card">
            <strong>${h.title}</strong>
            <p>Puan: ${h.score} | ${h.date}</p>
        </div>
    `).join('') : '<p class="empty-msg">Henüz kayıt yok.</p>';
}

// --- MODAL FONKSİYONLARI --
function pauseGame() { 
    clearInterval(gameState.timerInterval); 
    document.getElementById('pause-modal').style.display = 'flex'; 
}

function resumeGame() { 
    document.getElementById('pause-modal').style.display = 'none'; 
    startTimer(); 
}

function confirmExitGame() {
    if(confirm("Çıkmak istediğine emin misin? İlerlemen kaybolacak.")) {
        clearInterval(gameState.timerInterval);
        document.getElementById('pause-modal').style.display = 'none';
        showSection('home');
    }
}

document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('side-history');
    const toggleBtns = document.querySelectorAll('.history-toggle-btn');
    
    if (sidebar.classList.contains('active')) {
        let isClickInsideSidebar = sidebar.contains(e.target);
        let isClickOnButton = false;
        
        toggleBtns.forEach(btn => {
            if (btn.contains(e.target)) isClickOnButton = true;
        });

        if (!isClickInsideSidebar && !isClickOnButton) {
            sidebar.classList.remove('active');
        }
    }
});

window.onload = () => showSection('home');