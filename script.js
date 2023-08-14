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
      forecastCard.innerHTML = `
        <h3>${formatDate(forecast.dt)}</h3>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].main}">
        <p class="temp-max" data-temp="${forecast.main.temp_max}">${forecast.main.temp_max}°C</p>
        <p class="temp-min" data-temp="${forecast.main.temp_min}">${forecast.main.temp_min}°C</p>
        <p>${forecast.weather[0].description}</p>
      `;
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
    temperature.textContent = `${celsius}°C`;
  } else {
    const fahrenheit = toFahrenheit(celsius);
    temperature.textContent = `${fahrenheit}°F`;
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
  const maxTemps = document.querySelectorAll('.forecast-card .temp-max');
  const minTemps = document.querySelectorAll('.forecast-card .temp-min');

  if (isCelsius) {
    maxTemps.forEach(temp => {
      const celsius = temp.getAttribute('data-temp');
      temp.textContent = `${celsius}°C`;
    });
    minTemps.forEach(temp => {
      const celsius = temp.getAttribute('data-temp');
      temp.textContent = `${celsius}°C`;
    });
  } else {
    maxTemps.forEach(temp => {
      const celsius = temp.getAttribute('data-temp');
      const fahrenheit = toFahrenheit(Number(celsius));
      temp.textContent = `${fahrenheit}°F`;
    });
    minTemps.forEach(temp => {
      const celsius = temp.getAttribute('data-temp');
      const fahrenheit = toFahrenheit(Number(celsius));
      temp.textContent = `${fahrenheit}°F`;
    });
  }
}

// Initial call to fetch the weather data for a default city when the page loads
fetchForecast(); // Replace 'New York' with the desired default city
