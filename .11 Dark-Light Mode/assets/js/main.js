const themeBtn = document.getElementById('theme-btn');
const body = document.body;

themeBtn.addEventListener("click", () => {
    if (themeBtn.checked) {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }
})

themeBtn.addEventListener("change", () => {
    if (themeBtn.checked) {
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark')
    }
    
})

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeBtn.checked = true; 
}