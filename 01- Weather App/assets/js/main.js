const apiKey = "1ad8bb7e8d5b0a592a52c760c5f27c46";
const searchBtn = document.getElementById("city-input-btn");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");

const cityName = document.getElementById("city-name");
const dateText = document.getElementById("date");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const windSpeed = document.getElementById("wind-speed");

async function checkWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`
        );

        if (!response.ok) {
            alert("Şehir bulunamadı, lütfen tekrar deneyin.");
            return;
        }

        const data = await response.json();

        // Verileri ekrana basma
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        dateText.textContent = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description.toUpperCase();
        windSpeed.textContent = `Rüzgar Hızı: ${data.wind.speed} m/s`;
        
        // İkonu güncelleme
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Bilgi panelini görünür yapma
        weatherInfo.style.display = "block";

    } catch (error) {
        console.error("Hata oluştu:", error);
    }
}

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

// Enter tuşuna basınca da çalışsın
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(cityInput.value);
    }
});