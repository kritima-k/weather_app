const API_KEY = "8b7eee9532e86096ddca76171ff937fc";

// ===============================
// MAIN WEATHER FUNCTION
// ===============================
function getWeather() {
    const city = document.getElementById("city").value.trim();
    const result = document.getElementById("result");

    if (!city) {
        result.innerHTML = `<p class="text-danger">Please enter a city name</p>`;
        return;
    }

    result.innerHTML = `<p class="text-info">Loading weather data...</p>`;

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(weatherURL)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                result.innerHTML = `<p class="text-danger">City not found</p>`;
                return;
            }

            const { name } = data;
            const { temp, humidity } = data.main;
            const { description } = data.weather[0];
            const { speed } = data.wind;
            const { lat, lon } = data.coord;

            result.innerHTML = `
                <h5 class="mt-3">${name}</h5>
                <p>🌡 Temperature: ${temp} °C</p>
                <p>☁ Weather: ${description}</p>
                <p>💧 Humidity: ${humidity}%</p>
                <p>💨 Wind Speed: ${speed} m/s</p>

                <p id="aqi" class="text-muted">Fetching AQI...</p>
            `;

            getAQI(lat, lon);
        })
        .catch(() => {
            result.innerHTML = `<p class="text-danger">Error fetching weather data</p>`;
        });
}

// ===============================
// AQI FUNCTION
// ===============================
function getAQI(lat, lon) {
    const aqiDiv = document.getElementById("aqi");

    const aqiURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(aqiURL)
        .then(res => res.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;

            let aqiText = "";
            let badgeClass = "";

            if (aqi === 1) {
                aqiText = "Good";
                badgeClass = "bg-success";
            } else if (aqi === 2) {
                aqiText = "Fair";
                badgeClass = "bg-warning";
            } else if (aqi === 3) {
                aqiText = "Moderate";
                badgeClass = "bg-info";
            } else if (aqi === 4) {
                aqiText = "Poor";
                badgeClass = "bg-danger";
            } else if (aqi === 5) {
                aqiText = "Very Poor";
                badgeClass = "bg-dark";
            }

            aqiDiv.innerHTML = `
                🌫 AQI:
                <span class="badge ${badgeClass}">${aqiText}</span>
            `;
        })
        .catch(() => {
            aqiDiv.innerHTML = `<span class="text-danger">AQI data not available</span>`;
        });
}



