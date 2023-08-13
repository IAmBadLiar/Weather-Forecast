const apiKey = '09db4dfa1b7156cbdce6c6dd6500354b'; // Replace with your actual API key
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const forecastCards = document.getElementById('forecastCards');

searchBtn.addEventListener('click', async () => {
  const cityInput = document.getElementById('cityInput').value;
  if (cityInput) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`);
      const data = await response.json();

      cityName.textContent = data.name;
      temperature.textContent = `${data.main.temp}°C`;
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
        <p>${forecast.main.temp_max}°C / ${forecast.main.temp_min}°C</p>
        <p>${forecast.weather[0].description}</p>
      `;
      forecastCards.appendChild(forecastCard);
    });
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
