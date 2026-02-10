const todoInput = document.getElementById('todo-input');
const saveBtn = document.querySelector('.save-btn');
const clearInputBtn = document.querySelector('.delete-btn'); 
const clearTodosBtn = document.getElementById('clear-todos'); 
const clearDoneBtn = document.getElementById('clear-done');   
const todoList = document.querySelector('.left-side .todos-list');
const doneList = document.querySelector('.right-side .todos-list');
const dateBtn = document.querySelector('.date-btn');
const timeBtn = document.querySelector('.time-btn');

const pickerModal = document.getElementById('custom-picker-modal');
const customDateInput = document.getElementById('custom-date');
const customTimeInput = document.getElementById('custom-time');
const pickerSaveBtn = document.querySelector('.picker-save-btn');
const pickerCancelBtn = document.querySelector('.picker-cancel-btn');

let selectedDate = "";
let selectedTime = "";

let todos = JSON.parse(localStorage.getItem('myTodos')) || [];

function saveToLocalStorage() {
    try {
    localStorage.setItem('myTodos', JSON.stringify(todos));
  } catch (e) {
    alert("Storage is full or inaccessible.");
  }
}

[dateBtn, timeBtn].forEach(btn => {
    btn.addEventListener('click', () => {
        pickerModal.style.display = 'flex';
    });
});

pickerCancelBtn.addEventListener('click', () => {
    pickerModal.style.display = 'none';
});

pickerSaveBtn.addEventListener('click', () => {
    const d = customDateInput.value;
    const t = customTimeInput.value;

    if (d && t) {
        selectedDate = d;
        selectedTime = t;

        dateBtn.innerHTML = `<i class="fas fa-calendar-check"></i> ${d}`;
        dateBtn.style.background = 'var(--accent-green)';
        timeBtn.innerHTML = `<i class="fas fa-clock"></i> ${t}`;
        timeBtn.style.background = 'var(--accent-green)';

        pickerModal.style.display = 'none';
    } else {
        alert("Both the date and time need to be selected!");
    }
});

window.onclick = (e) => {
    if (e.target == pickerModal) pickerModal.style.display = 'none';
};

window.addEventListener("storage", (e) => {
  if (e.key === "myTodos") {
    todos = JSON.parse(e.newValue) || [];
    renderTodos();
  }
});


function dragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('todo-id', e.target.dataset.id);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    const id = e.target.dataset.id;
    const isCompleted = e.target.closest('.right-side') !== null;
    const todo = todos.find(t => t.id == id);
    if (todo) {
        todo.status = isCompleted ? 'completed' : 'pending';
        if (isCompleted) todo.urgency = ''; 
        saveToLocalStorage();
        updateStats();
        renderTodos(); 
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

[todoList, doneList].forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault(); 
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
        container.classList.add('drag-over');
    });
    container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
    });
});

function addTodo() {
    const text = todoInput.value.trim();
    if (text === "") return;
    
    if (!selectedDate || !selectedTime) {
        alert("Please select the date and time first!");
        pickerModal.style.display = 'flex'; 
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        status: 'pending',
        date: selectedDate,
        time: selectedTime,
        priority: 'priority-medium',
        urgency: ''
    };

    todos.push(newTodo);
    saveToLocalStorage();
    renderTodos();

    todoInput.value = "";
    selectedDate = "";
    selectedTime = "";
    customDateInput.value = "";
    customTimeInput.value = "";
    dateBtn.innerHTML = `<i class="fas fa-calendar-day"></i> Select Date`;
    dateBtn.style.background = 'var(--accent-purple)';
    timeBtn.innerHTML = `<i class="fas fa-stopwatch"></i> Reminder`;
    timeBtn.style.background = 'var(--accent-purple)';
}

function checkDeadlines() {
    const now = new Date();
    let changed = false;

    todos.forEach(todo => {
        if (todo.status === 'pending') {
            const taskDate = new Date(`${todo.date}T${todo.time}`);
            if (isNaN(taskDate)) return;
            const diffInMinutes = (taskDate - now) / 1000 / 60;

            let newUrgency = '';
            if (diffInMinutes <= 0) {
                newUrgency = 'expired'; 
            } else if (diffInMinutes <= 30) {
                newUrgency = 'urgent'; 
            }

            if (todo.urgency !== newUrgency) {
                todo.urgency = newUrgency;
                changed = true;
            }
        } else {
            if (todo.urgency !== '') {
                todo.urgency = '';
                changed = true;
            }
        }
    });

    if (changed) {
        saveToLocalStorage();
        renderTodos();
    }
}

function renderTodos() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach(todo => {
        const todoDiv = document.createElement("div");
        todoDiv.className = `todo ${todo.priority || ''} ${todo.urgency || ''}`;
        todoDiv.draggable = true;
        todoDiv.dataset.id = todo.id;

        todoDiv.addEventListener('dragstart', dragStart);
        todoDiv.addEventListener('dragend', dragEnd);

        todoDiv.innerHTML = `
            <div class="pick-up"><i class="fa-solid fa-grip-vertical"></i></div>
            <div class="todo-text">
                <h3>${todo.text}</h3>
                <div class="todo-date">
                    <span>${todo.time}</span>
                    <span>${todo.date}</span>
                </div>
            </div>
            <div class="todo-buttons">
                ${todo.status === 'pending' 
                    ? `<button class="true-check" onclick="changeStatus(${todo.id}, 'completed')"><i class="fa-solid fa-check"></i></button>` 
                    : `<button class="undo-todo" onclick="changeStatus(${todo.id}, 'pending')"><i class="fa-solid fa-rotate-left"></i></button>`
                }
                <button class="delete-todo" onclick="deleteTodo(${todo.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;

        if (todo.status === 'pending') {
            todoList.appendChild(todoDiv);
        } else {
            doneList.appendChild(todoDiv);
        }
    });
    updateStats();
}

clearInputBtn.addEventListener('click', () => { todoInput.value = ""; });

clearTodosBtn.addEventListener('click', () => {
    todos = todos.filter(t => t.status !== 'pending');
    saveToLocalStorage();
    renderTodos();
});

clearDoneBtn.addEventListener('click', () => {
    todos = todos.filter(t => t.status !== 'completed');
    saveToLocalStorage();
    renderTodos();
});

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTodos();
}

function changeStatus(id, newStatus){
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.status = newStatus;
        if (newStatus === 'completed') todo.urgency = '';
        saveToLocalStorage();
        renderTodos();
    }
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const countTag = document.querySelector('.count-tag');
    if(countTag) countTag.innerText = `${pending} tasks`;
    
    const statValues = document.querySelectorAll('.stat-value');
    if(statValues.length >= 3) {
        statValues[0].innerText = `${percentage}%`;
        statValues[1].innerText = completed;
        statValues[2].innerText = pending;
    }
    const progressBar = document.querySelector('.progress-bar-fill');
    if(progressBar) progressBar.style.width = `${percentage}%`;
}

todoInput.addEventListener('drop', (e) => { e.preventDefault(); e.stopPropagation(); });

saveBtn.addEventListener('click', addTodo);

setInterval(checkDeadlines, 30000);

renderTodos();
checkDeadlines();