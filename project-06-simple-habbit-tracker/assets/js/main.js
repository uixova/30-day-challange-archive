const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const habitList = document.getElementById('habitList');

habitList.innerHTML = '';

function addHabit() {
    const text = habitInput.value.trim();

    if (text === "") {
        alert("Lütfen bir alışkanlık gir!");
        return;
    }

    const habitItem = document.createElement('div');
    habitItem.classList.add('habit-item');

    habitItem.innerHTML = `
        <div class="habit-info">
            <div class="status-dot"></div>
            <span>${text}</span>
        </div>
        <div class="actions">
            <button class="check-btn"><i class="bi bi-check-lg"></i></button>
            <button class="delete-btn"><i class="bi bi-trash"></i></button>
        </div>
    `;

    habitList.appendChild(habitItem);

    const delBtn = habitItem.querySelector('.delete-btn');
    const chkBtn = habitItem.querySelector('.check-btn');

    delBtn.onclick = function() {
        habitItem.remove();
    };

    chkBtn.onclick = function() {
        habitItem.classList.toggle('completed');
    };

    habitInput.value = '';
}

addBtn.onclick = addHabit;

habitInput.onkeypress = function(e) {
    if (e.key === 'Enter') {
        addHabit();
    }
};