const apiKey = "1ad8bb7e8d5b0a592a52c760c5f27c46";
const searchInput = document.getElementById("searchCity");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const mainTemp = document.getElementById("mainTemp");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const currentDate = document.getElementById("currentDate");

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        if (!response.ok) {
            alert("Şehir bulunamadı!");
            return; 
        }

        console.log("API'den gelen veri:", data);
        console.log("Tahmin Verisi:", forecastData);
        updateUI(data);
        renderForecast(forecastData);

    } catch (error) {
        console.error("Hata çıktı aga:", error);
    }
}

function updateUI(data) {
    if (!cityName || !mainTemp) return;

    cityName.innerText = `${data.name}, ${data.sys.country}`;
    mainTemp.innerText = `${Math.round(data.main.temp)}°C`;
    
    description.innerText = data.weather[0].description;
    
    humidity.innerText = `%${data.main.humidity}`;
    wind.innerText = `${data.wind.speed} km/h`;

    if (mainIcon) {
        const iconCode = data.weather[0].icon;
        mainIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    const options = { day: 'numeric', month: 'long', weekday: 'long' };
    currentDate.innerText = new Date().toLocaleDateString('tr-TR', options);

    changeTheme(data.weather[0].main);
}

function renderForecast(data) {
    forecastContainer.innerHTML = ""; 
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(item => {
        const dayName = new Date(item.dt * 1000).toLocaleDateString('tr-TR', { weekday: 'short' });
        
        const card = document.createElement("div");
        card.className = "forecast-card";
        
        card.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Hava Durumu">
            <p class="temp">${Math.round(item.main.temp)}°C</p>
        `;

        card.addEventListener("click", () => {
            updateUIFromForecast(item);
            changeTheme(item.weather[0].main);
        });
        
        forecastContainer.appendChild(card); 
    });
}

function updateUIFromForecast(item) {
    mainTemp.innerText = `${Math.round(item.main.temp)}°C`;
    description.innerText = item.weather[0].description;
    humidity.innerText = `%${item.main.humidity}`;
    wind.innerText = `${item.wind.speed} km/h`;

    const iconCode = item.weather[0].icon;
    const mainIcon = document.getElementById("mainIcon");
    if (mainIcon) {
        mainIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    const options = { day: 'numeric', month: 'long', weekday: 'long' };
    currentDate.innerText = new Date(item.dt * 1000).toLocaleDateString('tr-TR', options);

    changeTheme(item.weather[0].main);
}

function changeTheme(weatherStatus) {
    const body = document.body;
    
    body.className = ""; 

    const status = weatherStatus.toLowerCase(); 

    if (status.includes("cloud")) {
        body.classList.add("theme-clouds");
    } else if (status.includes("rain") || status.includes("drizzle") || status.includes("thunder")) {
        body.classList.add("theme-rain");
    } else if (status.includes("clear")) {
        body.classList.add("theme-clear");
    } else if (status.includes("snow")) {
        body.classList.add("theme-snow");
    } else {
        body.classList.add("theme-mist");
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});