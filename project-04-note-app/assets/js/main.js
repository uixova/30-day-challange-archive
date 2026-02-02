const colorBtns = document.querySelectorAll(".color-btn");
const noteArea = document.getElementById("note");
const fontBtns = document.querySelectorAll(".font");
const saveBtn = document.querySelector(".save-note");
const historyArea = document.querySelector(".history-area");
const clearAllBtn = document.getElementById("clear-all");
const searchInput = document.getElementById("search-note");
const fontPlus = document.getElementById("font-plus");
const fontMinus = document.getElementById("font-minus");
const fontSizeDisplay = document.getElementById("font-size-display");

let noteTemplate = document.querySelector(".history.template").cloneNode(true);
let currentNoteId = null;
let lastSavedWordCount = 0;
let currentFontSize = 16;
let currentStyle = { color: "#fffdec", font: "Arial, sans-serif" };

const getWordCount = (text) => {
    const trimmedText = text.trim();

    if (!trimmedText) return 0;

    const words = trimmedText.split(/\s+/);

    return words.filter(word => word.length >= 4).length;
};

const renderNotes = (filterTerm = "") => {
    const notes = JSON.parse(localStorage.getItem("myNotes")) || [];

    historyArea.innerHTML = '';

    const filteredNotes = notes.filter(n => 
        n.text.toLowerCase().includes(filterTerm.toLowerCase())
    );

    filteredNotes.forEach(note => {
        const clone = noteTemplate.cloneNode(true);

        clone.classList.remove("template");
        clone.style.display = "flex";
        clone.querySelector("h4").innerText = note.date;
        clone.querySelector("p").innerText = note.text.substring(0, 30) + "...";
        clone.style.setProperty('background-color', note.color, 'important');
        clone.style.fontFamily = note.font;
        clone.setAttribute("data-id", note.id);

        historyArea.appendChild(clone);
    });
};

const autoSave = () => {
    let notes = JSON.parse(localStorage.getItem("myNotes")) || [];
    const text = noteArea.value;

    if (currentNoteId === null) {
        currentNoteId = Date.now();
    }

    const noteData = {
        id: currentNoteId,
        text: text,
        color: currentStyle.color,
        font: currentStyle.font,
        fontSize: currentFontSize,
        date: new Date().toLocaleString()
    };

    const existingIndex = notes.findIndex(n => n.id === currentNoteId);

    if (existingIndex !== -1) {
        notes[existingIndex] = noteData;
    } else {
        notes.unshift(noteData);
    }

    localStorage.setItem("myNotes", JSON.stringify(notes));

    renderNotes(searchInput.value);
};

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const color = btn.getAttribute("data-value");

        noteArea.style.backgroundColor = color;
        currentStyle.color = color;
    });
});

fontBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const font = btn.getAttribute("data-font");

        noteArea.style.fontFamily = font;
        currentStyle.font = font;
    });
});

noteArea.addEventListener("input", () => {
    const count = getWordCount(noteArea.value);

    if (count >= 15 && lastSavedWordCount === 0) {
        autoSave();
        lastSavedWordCount = count;
    } else if (lastSavedWordCount !== 0 && count >= lastSavedWordCount + 50) {
        autoSave();
        lastSavedWordCount = count;
    }
});

saveBtn.addEventListener("click", () => {
    if (noteArea.value.trim().length > 0) {
        autoSave();
    } else {
        alert("Boş notu kaydedemem!");
    }
});

clearAllBtn.addEventListener("click", () => {
    if (confirm("Tüm geçmiş silinecek!")) {
        localStorage.removeItem("myNotes");

        currentNoteId = null;
        noteArea.value = "";
        lastSavedWordCount = 0;

        renderNotes();
    }
});

searchInput.addEventListener("input", (e) => renderNotes(e.target.value));

fontPlus.addEventListener("click", () => {
    if (currentFontSize < 32) {
        currentFontSize += 2;
        noteArea.style.fontSize = currentFontSize + "px";
        fontSizeDisplay.innerText = currentFontSize + "px";

        if (currentNoteId !== null) {
            autoSave();
        }
    }
});

fontMinus.addEventListener("click", () => {
    if (currentFontSize > 10) {
        currentFontSize -= 2;
        noteArea.style.fontSize = currentFontSize + "px";
        fontSizeDisplay.innerText = currentFontSize + "px";

        if (currentNoteId !== null) {
            autoSave();
        }
    }
});

historyArea.addEventListener("click", (e) => {
    const noteEl = e.target.closest(".history");

    if (!noteEl) return;

    const id = Number(noteEl.getAttribute("data-id"));
    let notes = JSON.parse(localStorage.getItem("myNotes")) || [];

    // Silme İşlemi
    if (e.target.closest(".note-delete")) {
        if (confirm("Silinsin mi?")) {
            notes = notes.filter(n => n.id !== id);
            localStorage.setItem("myNotes", JSON.stringify(notes));

            if (currentNoteId === id) {
                currentNoteId = null;
                noteArea.value = "";
                lastSavedWordCount = 0;
            }

            renderNotes(searchInput.value);
        }
    }

    // Not Yükleme İşlemi
    if (e.target.closest(".note-change")) {
        const note = notes.find(n => n.id === id);

        if (note) {
            noteArea.value = note.text;
            noteArea.style.backgroundColor = note.color;
            noteArea.style.fontFamily = note.font;
            noteArea.style.fontSize = (note.fontSize || 16) + "px";

            currentNoteId = note.id;
            currentStyle = { color: note.color, font: note.font };
            currentFontSize = note.fontSize || 16;
            fontSizeDisplay.innerText = currentFontSize + "px";
            lastSavedWordCount = getWordCount(note.text);
        }
    }

    // İndirme İşlemi
    if (e.target.closest(".note-download")) {
        const note = notes.find(n => n.id === id);

        if (note) {
            const blob = new Blob([note.text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `note-${id}.txt`;
            a.click();

            URL.revokeObjectURL(url);
        }
    }
});

window.addEventListener("load", () => {
    const notes = JSON.parse(localStorage.getItem("myNotes")) || [];

    if (notes.length > 0) {
        const last = notes[0];

        noteArea.value = last.text;
        noteArea.style.backgroundColor = last.color;
        noteArea.style.fontFamily = last.font;
        noteArea.style.fontSize = (last.fontSize || 16) + "px";

        currentNoteId = last.id;
        currentStyle = { color: last.color, font: last.font };
        currentFontSize = last.fontSize || 16;
        fontSizeDisplay.innerText = currentFontSize + "px";
        lastSavedWordCount = getWordCount(last.text);
    }

    renderNotes();
});