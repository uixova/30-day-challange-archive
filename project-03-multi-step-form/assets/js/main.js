const circles = document.querySelectorAll(".circle"),
      progressBar = document.querySelector(".indicator"),
      buttons = document.querySelectorAll(".step-buttons button"),
      stepContents = document.querySelectorAll(".step-content"),
      nextBtn = document.getElementById("next"),
      prevBtn = document.getElementById("prev"),
      finishBtn = document.getElementById("finish");

let currentStep = 1;

// 2. Doğrulama Fonksiyonu
const checkValidation = () => {
    const activeStep = document.querySelector(".step-content.active");
    if (!activeStep) return;

    const inputs = activeStep.querySelectorAll("input[required]");
    let isStepValid = true;

    // input[required] olanları kontrol et
    inputs.forEach(input => {
        if (!input.value.trim() || !input.checkValidity()) {
            isStepValid = false;
        }
    });

    // 2. Şifrelerin Uyuşma Kontrolü 
    if (activeStep.id === "step-2") {
        const pass = document.getElementById("password").value;
        const passConfirm = document.getElementById("passwordConfirm").value;
        const errorMsg = document.getElementById("passError");

        if (pass !== passConfirm && passConfirm.length > 0) {
            isStepValid = false;
            errorMsg.style.display = "block";
        } else {
            errorMsg.style.display = "none";
        }
        
        // Şifreler tamamen boş olmamalı ve birebir aynı olmalı
        if (!pass || !passConfirm || pass !== passConfirm) {
            isStepValid = false;
        }
    }

    // Adım 3'teki özel checkbox kontrolü
    if (activeStep.id === "step-3") {
        const terms = document.getElementById("terms");
        if (terms && !terms.checked) isStepValid = false;
    }

    // Butonların görünürlük ve aktiflik ayarları
    if (currentStep === 4) {
        nextBtn.style.display = "none";
        prevBtn.style.display = "none";
        finishBtn.style.display = "block";
    } else {
        nextBtn.style.display = "block";
        prevBtn.style.display = "block";
        finishBtn.style.display = "none";
        // Next butonunu sadece doğrulama geçerliyse aç
        nextBtn.disabled = !isStepValid;
    }
};

// 3. Adım Güncelleme Fonksiyonu
const updateSteps = (e) => {
    if (e.target.id === "finish") return;

    currentStep = e.target.id === "next" ? ++currentStep : --currentStep;

    circles.forEach((circle, index) => {
        circle.classList.toggle("active", index < currentStep);
    });

    progressBar.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;

    stepContents.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep - 1);
    });

    prevBtn.disabled = currentStep === 1;
    
    // Yeni adıma geçince oranın inputlarını kontrol et
    checkValidation();
};

// 4. Event Listeners
buttons.forEach((button) => {
    button.addEventListener("click", updateSteps);
});

// Hem yazı yazıldığında hem checkbox değiştiğinde kontrol et
document.addEventListener("input", checkValidation);
document.addEventListener("change", checkValidation);

finishBtn.addEventListener("click", () => {
    alert("Tebrikler! Kaydınız başarıyla tamamlandı.");
    window.location.reload(); 
});

// Sayfa açıldığında ilk kontrolü yap
checkValidation();