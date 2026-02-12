const generateBtn = document.querySelector('.generate');
const palettes = document.querySelectorAll('.color-palette');

function getRandomColor() {
    const chars = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updatePalettes() {
    let isBodyColorLocked = false;
    
    palettes.forEach(p => {
        const hex = p.querySelector('.color-hex').innerText.toUpperCase();
        const isLocked = p.querySelector('.lock-btn').dataset.locked === "true";
        const activeColorOnBody = document.body.getAttribute('data-active-color');
        
        if (isLocked && activeColorOnBody === hex) {
            isBodyColorLocked = true;
        }
    });

    if (!isBodyColorLocked) {
        document.body.style.backgroundColor = "#f0f2f5";
        document.body.removeAttribute('data-active-color');
    }

    palettes.forEach(palette => {
        const colorLine = palette.querySelector('.color-line');
        const hexText = palette.querySelector('.color-hex');
        const lockBtn = palette.querySelector('.lock-btn');

        if (lockBtn.dataset.locked === "true") return;

        const newColor = getRandomColor();
        colorLine.style.backgroundColor = newColor;
        hexText.innerText = newColor;
    });
}

palettes.forEach(palette => {
    const lockBtn = palette.querySelector('.lock-btn');
    const copyBtn = palette.querySelector('.copy-btn');
    const colorLine = palette.querySelector('.color-line');
    const hexText = palette.querySelector('.color-hex');

    lockBtn.addEventListener('click', () => {
        const icon = lockBtn.querySelector('i');
        const isLocked = lockBtn.dataset.locked === "true";
        
        lockBtn.dataset.locked = !isLocked;
        icon.classList.toggle('fa-lock-open');
        icon.classList.toggle('fa-lock');
    });

    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const color = hexText.innerText;
        navigator.clipboard.writeText(color).then(() => {
            const icon = copyBtn.querySelector('i');
            const originalClass = icon.className;
            icon.className = "fa-solid fa-check";
            setTimeout(() => {
                icon.className = originalClass;
            }, 1000);
        });
    });

    colorLine.addEventListener('click', () => {
        const color = hexText.innerText.toUpperCase();
        document.body.style.backgroundColor = color;
        document.body.setAttribute('data-active-color', color);
    });
});

generateBtn.addEventListener('click', updatePalettes);

window.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
        e.preventDefault(); 
        updatePalettes();
    }
});

updatePalettes();