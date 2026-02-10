const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input'); 
const confirmPasswordInput = document.getElementById('password-input-again'); 
const signupBtn = document.getElementById('form-btn');

const passwordCriteria = document.getElementById('password-criteria-list');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');

const criteriaItems = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number')
};

usernameInput.addEventListener("input", (e) => {
    let value = e.target.value;
    e.target.value = value.replace(/[^a-zA-Z0-9]/g, '');

    if (e.target.value.length > 0) {
        usernameError.style.display = "none";
        usernameInput.parentElement.classList.remove('invalid');
    } else {
        usernameError.style.display = "block";
        usernameInput.parentElement.classList.add('invalid');
    };

    checkFormValidity();
});

passwordInput.addEventListener("input", (e) => {
    const value = e.target.value;

    passwordCriteria.style.display =    value.length > 0 ? 'flex' : 'none';

    updateCriteria(criteriaItems.length, value.length >= 8); //uzunluk kontrolü

    updateCriteria(criteriaItems.uppercase, /[A-Z]/.test(value)); //büyük harf kontrol

    updateCriteria(criteriaItems.lowercase, /[a-z]/.test(value)); //küçük harf kontrol

    updateCriteria(criteriaItems.number, /[0-9]/.test(value)); //number kontrolü

    checkFormValidity();
});

function updateCriteria(element, isValid) {
    const icon = element.querySelector('i');

    if (isValid) {
        element.style.color = "#2ecc71";
        icon.classList.replace('fa-circle-xmark', 'fa-circle-check');
        icon.style.color = '#2ecc71';
    } else {
        element.style.color = '#888'; 
        icon.classList.replace('fa-circle-check', 'fa-circle-xmark');
        icon.style.color = '#ff4d4d';
    };
};

passwordInput.addEventListener('input', (e) => {
    const value = e.target.value;

    const isLengthValid = value.length >= 8;
    const isUpperValid = /[A-Z]/.test(value);
    const isLowerValid = /[a-z]/.test(value);
    const isNumberValid = /[0-9]/.test(value);

    updateCriteria(criteriaItems.length, isLengthValid);
    updateCriteria(criteriaItems.uppercase, isUpperValid);
    updateCriteria(criteriaItems.lowercase, isLowerValid);
    updateCriteria(criteriaItems.number, isNumberValid);

    const allValid = isLengthValid && isUpperValid && isLowerValid && isNumberValid;

    if (allValid || value.length === 0) {
        passwordCriteria.style.display = 'none';
    } else {
        passwordCriteria.style.display = 'flex';
    }

    checkFormValidity();
});

confirmPasswordInput.addEventListener("input", (e) => {
    const value = e.target.value;

    if (value !== passwordInput.value && value.length > 0) {
        passwordError.style.display = 'block';
        confirmPasswordInput.parentElement.classList.add('invalid');
    } else {
        passwordError.style.display = 'none';
        confirmPasswordInput.parentElement.classList.remove('invalid');
    }

    checkFormValidity();
});

emailInput.addEventListener("input", (e) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailInput.value)) {
        emailInput.parentElement.classList.remove('invalid');
    } else {
        emailInput.parentElement.classList.add('invalid');
    }

    checkFormValidity();
});

function checkFormValidity() {
    const isUsernameValid = usernameInput.value.length >= 3;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);

    const isPasswordStrong = 
        passwordInput.value.length >= 8 &&
        /[A-Z]/.test(passwordInput.value) &&
        /[a-z]/.test(passwordInput.value) &&
        /[0-9]/.test(passwordInput.value);

    const isPasswordMatch = confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value.length > 0;

    if (isUsernameValid && isEmailValid && isPasswordStrong && isPasswordMatch) {
        signupBtn.style.pointerEvents = 'auto';
        signupBtn.style.opacity = '1';
        signupBtn.style.cursor = 'pointer';
    } else {
        signupBtn.style.pointerEvents = 'none';
        signupBtn.style.opacity = '0.5';
        signupBtn.style.cursor = 'not-allowed';
    };
};



checkFormValidity();