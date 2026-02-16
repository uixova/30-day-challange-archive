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
        showBanner("Bu kullanıcı adı zaten alınmış aga!");
        return;
    }

    if (signPass.value !== confirmPass.value) {
        showBanner("Şifreler uyuşmuyor!");
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

    showBanner("Kayıt başarılı kanka! Giriş yapabilirsin.", true);
    signupForm.reset();
    toggleForm('login');
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(u => u.username === logUser.value && u.pass === logPass.value);

    if (userFound) {
        showBanner(`Hoş geldin ${userFound.name}! Giriş başarılı.`, true);
        loginForm.reset();
    } else {
        showBanner("Kullanıcı adı veya şifre hatalı!");
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
        showBanner("Kullanıcı adı veya mevcut şifre hatalı!");
        return;
    };

    if (newPass !== confirmNewPass) {
        showBanner("Yeni şifreler uyuşmuyor!");
        return;
    };

    if (currentPass === newPass) {
        showBanner("Yeni şifre eskisinden farklı olmalı!");
        return;
    }

    users[userIndex].pass = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    showBanner("Şifren güncellendi kanka!", true);
    resetForm.reset();
    toggleForm('login');
});