const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const todayElement = document.getElementById('today');
const timeInput = document.getElementById('hm-select');
const tagInput = document.getElementById('add-tag');
const addAlarmBtn = document.querySelector('.alarm-add-btn');
const alarmList = document.querySelector('.alarm-list');
const alarmSound = new Audio('assets/audio/alarm.mp3');
alarmSound.loop = true;

const alarmScreen = document.getElementById('alarm-screen');
const ringingTag = document.getElementById('ringing-tag');
const ringingTime = document.getElementById('ringing-time');
const stopBtn = document.getElementById('stop-alarm-btn');

let alarms = JSON.parse(localStorage.getItem('myAlarms')) || [];
let currentActiveAlarm = null;
let lastCheckedMinute = ""; 

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const currentTimeString = `${hours}:${minutes}`; 
    clockElement.innerText = `${hours}:${minutes}:${seconds}`;
    
    if (seconds === "00" && lastCheckedMinute !== currentTimeString) {
        lastCheckedMinute = currentTimeString; 
        checkAlarms(currentTimeString);
    }

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateElement.innerText = now.toLocaleDateString('en-US', options);
    const dayOptions = { weekday: 'long' };
    todayElement.innerText = now.toLocaleDateString('en-US', dayOptions);
}

addAlarmBtn.addEventListener("click", () => {
    const timeValue = timeInput.value;
    const tagValue = tagInput.value || "Alarm";

    if (!timeValue) {
        alert("You didn't choose a time, when should I wake you up?");
        return;
    }

    const isDuplicate = alarms.some(a => a.time === timeValue);
    if (isDuplicate) {
        alert("Aga bu saate zaten alarmın var!");
        return;
    }

    const newAlarm = {
        id: Date.now(),
        time: timeValue,
        tag: tagValue,
        isActive: true
    };

    alarms.push(newAlarm);
    saveAlarms();
    renderAlarms();

    timeInput.value = "";
    tagInput.value = "";
});

function saveAlarms() {
    localStorage.setItem('myAlarms', JSON.stringify(alarms));
}

function renderAlarms() {
    alarmList.innerHTML = "";
    alarms.forEach(alarm => {
        const alarmDiv = document.createElement('div');
        alarmDiv.className = `alarm ${alarm.isActive ? '' : 'inactive'}`;
        alarmDiv.innerHTML = `
            <div class="alarm-time"><span>${alarm.time}</span></div>
            <div class="alarm-tag"><span>${alarm.tag}</span></div>
            <div class="alarm-box-btn">
                <label class="switch">
                    <input type="checkbox" ${alarm.isActive ? 'checked' : ''} onchange="toggleAlarm(${alarm.id})">
                    <span class="slider round"></span>
                </label>
                <button class="delete-alarm" onclick="deleteAlarm(${alarm.id})"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        `;
        alarmList.appendChild(alarmDiv);
    });
}

function deleteAlarm(id) {
    alarms = alarms.filter(a => a.id !== id);
    saveAlarms();
    renderAlarms();
}

function toggleAlarm(id) {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
        alarm.isActive = !alarm.isActive;
        saveAlarms();
        renderAlarms();
    }
}

function checkAlarms(currentLocalTime) {
    if (currentActiveAlarm !== null) return;

    alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentLocalTime) {
            playAlarm(alarm);
        }
    });
}

function playAlarm(alarm) {
    currentActiveAlarm = alarm;
    ringingTag.innerText = alarm.tag;
    ringingTime.innerText = alarm.time;
    alarmScreen.style.display = 'flex';
    alarmSound.play().catch(e => console.log("Autoplay engellendi, etkileşim lazım."));
}

stopBtn.addEventListener('click', () => {
    if (currentActiveAlarm) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        currentActiveAlarm.isActive = false;
        saveAlarms();
        renderAlarms();
        
        alarmScreen.style.display = 'none';
        currentActiveAlarm = null;
    }
});

setInterval(updateClock, 500);
updateClock();
renderAlarms();