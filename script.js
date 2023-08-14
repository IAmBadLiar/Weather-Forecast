const apiKey = '09db4dfa1b7156cbdce6c6dd6500354b'; // Replace with your actual API key
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const forecastCards = document.getElementById('forecastCards');
const temperatureUnitToggle = document.getElementById('temperatureUnitToggle');
let isCelsius = true;

searchBtn.addEventListener('click', async () => {
  const cityInput = document.getElementById('cityInput').value;
  if (cityInput) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`);
      const data = await response.json();

      cityName.textContent = data.name;
      updateTemperature(data.main.temp);
      description.textContent = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}.png`;
      weatherIcon.alt = data.weather[0].main;

      fetchForecast(cityInput);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
});

async function fetchForecast(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00'));

    forecastCards.innerHTML = '';
    dailyForecasts.forEach(forecast => {
      const forecastCard = document.createElement('div');
      forecastCard.className = 'forecast-card';
      const tempMaxCelsius = forecast.main.temp_max;
      const tempMinCelsius = forecast.main.temp_min;
      const tempMaxFahrenheit = toFahrenheit(tempMaxCelsius);
      const tempMinFahrenheit = toFahrenheit(tempMinCelsius);
      const tempMax = isCelsius ? `${tempMaxCelsius.toFixed(1)}°C` : `${tempMaxFahrenheit.toFixed(1)}°F`;
      const tempMin = isCelsius ? `${tempMinCelsius.toFixed(1)}°C` : `${tempMinFahrenheit.toFixed(1)}°F`;

      forecastCard.innerHTML = `
        <h3>${formatDate(forecast.dt)}</h3>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].main}">
        <p>${tempMax} / ${tempMin}</p>
        <p>${forecast.weather[0].description}</p>
       
<p>Humidity: ${forecast.main.humidity}%</p>
        <p>Wind Speed: ${forecast.wind.speed.toFixed(1)} m/s</p>      `;
      forecastCards.appendChild(forecastCard);
    });
    updateTemperatureUnits();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function updateTemperature(celsius) {
  if (isCelsius) {
    temperature.textContent = `${celsius.toFixed(1)}°C`;
  } else {
    const fahrenheit = toFahrenheit(celsius);
    temperature.textContent = `${fahrenheit.toFixed(1)}°F`;
  }
}

function toFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

temperatureUnitToggle.addEventListener('click', () => {
  isCelsius = !isCelsius;
  updateTemperature(data.main.temp);
  updateTemperatureUnits();
});

function updateTemperatureUnits() {
  const maxMinTemps = document.querySelectorAll('.forecast-card p:nth-child(3)');

  maxMinTemps.forEach(tempElement => {
    const tempText = tempElement.textContent;
    const tempCelsius = parseFloat(tempText); // Assuming the first part of the text is the temperature
    if (!isNaN(tempCelsius)) {
      const tempFahrenheit = toFahrenheit(tempCelsius);
      const updatedTempText = isCelsius ? `${tempCelsius.toFixed(1)}°C` : `${tempFahrenheit.toFixed(1)}°F`;
      tempElement.textContent = updatedTempText;
    }
  });
}

  humidities.forEach(humidityElement => {
    const humidityText = humidityElement.textContent;
    const humidityValue = parseInt(humidityText.replace('Humidity: ', '').replace('%', ''));
    if (!isNaN(humidityValue)) {
      const updatedHumidityText = `Humidity: ${humidityValue}%`;
      humidityElement.textContent = updatedHumidityText;
    }
  });

  windSpeeds.forEach(windSpeedElement => {
    const windSpeedText = windSpeedElement.textContent;
    const windSpeedValue = parseFloat(windSpeedText.replace('Wind Speed: ', '').replace(' m/s', ''));
    if (!isNaN(windSpeedValue)) {
      const updatedWindSpeedText = `Wind Speed: ${windSpeedValue.toFixed(1)} m/s`;
      windSpeedElement.textContent = updatedWindSpeedText;
    }
  });
}

// Initial call to fetch the weather data for a default city when the page loads
fetchForecast(); // Replace 'New York' with the desired default city
