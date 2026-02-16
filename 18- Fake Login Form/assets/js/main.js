const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const resetForm = document.getElementById("resetForm");

const signPass = document.getElementById("signPass");
const confirmPass = document.getElementById("confirmPass");
const signUser = document.getElementById("signUser");
const signEmail = document.getElementById("signEmail");
const signName = document.getElementById("signName");
const signSurname = document.getElementById("signSurname");

const logUser = document.getElementById("logUser");
const logPass = document.getElementById("logPass");

function showBanner(message, isSuccess = false) {
    const banner = document.getElementById("InfoBanner");
    const bannerText = banner.querySelector(".reversedLeft");
    const reversedRight = banner.querySelector(".reversedRight");

    bannerText.innerText = `${message}`;

    const color = isSuccess ? "#4CAF50" : "#ef5350";
    bannerText.style.backgroundColor = color;
    reversedRight.style.backgroundColor = color;

    const styleTag = document.getElementById("bannerStyle") || document.createElement("style");
    styleTag.id = "bannerStyle";
    styleTag.innerHTML = `.reversed:before, .reversed:after, .reversedLeft:before, .reversedLeft:after { border-top-color: ${color} !important; border-bottom-color: ${color} !important; }`;
    document.head.appendChild(styleTag);

    banner.style.display = "block";

    setTimeout(() => {
        banner.style.display = "none";
    }, 3000);
}

function toggleForm(formType) {
    document.querySelectorAll('.form-box').forEach(box => {
        box.style.display = "none";
    });
    const activeForm = document.getElementById(formType + "Box");
    if (activeForm) activeForm.style.display = "block";
}

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const signMatchError = document.getElementById("signMatchError");
    signMatchError.innerText = '';

    if (users.some(u => u.username === signUser.value)) {
        showBanner("This username is already taken!");
        return;
    }

    if (signPass.value !== confirmPass.value) {
        showBanner("Passwords don't match!");
        return;
    }

    const newUser = {
        username: signUser.value,
        email: signEmail.value,
        pass: signPass.value,
        name: signName.value,
        surname: signSurname.value
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showBanner("Registration is successful, buddy! You can log in.", true);
    signupForm.reset();
    toggleForm('login');
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(u => u.username === logUser.value && u.pass === logPass.value);

    if (userFound) {
        showBanner(`Welcome ${userFound.name}! Login is successful.`, true);
        loginForm.reset();
    } else {
        showBanner("Username or password is incorrect!");
    }
});

resetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const resetUser = document.getElementById("resetUser").value;
    const currentPass = document.getElementById("currentPass").value;
    const newPass = document.getElementById("newPass").value;
    const confirmNewPass = document.getElementById("confirmNewPass").value;

    const userIndex = users.findIndex(u => u.username === resetUser && u.pass === currentPass);

    if (userIndex === -1) {
        showBanner("Username or current password is incorrect!");
        return;
    };

    if (newPass !== confirmNewPass) {
        showBanner("New passwords don't match!");
        return;
    };

    if (currentPass === newPass) {
        showBanner("The new password should be different from the old one!");
        return;
    }

    users[userIndex].pass = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    showBanner("Your password has been updated!", true);
    resetForm.reset();
    toggleForm('login');
});