
const buttonSubmitCity = document.querySelector(".submitCityName");
const inputField = document.querySelector('#cityName');
const cityNameElement = document.querySelector('#city');
// Select the HTML elements where you want to display weather information
const temperatureElement = document.querySelector('#temperature');
const descriptionElement = document.querySelector('#description');
const dailyForecastElement = document.querySelector('#daily-forecast');
const iconElement = document.querySelector('#weather-icon');

const API_URL_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search?count=10&language=en&format=json';
const API_URL_WEATHER = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,showers,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe%2FLondon&forecast_days=3';

// Map weather codes to detailed descriptions
const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    48: 'Fog',
    45: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Light rain shower',
    63: 'Rain shower',
    65: 'Heavy rain shower',
    66: 'Light freezing rain',
    67: 'heavy freezing rain',
    71: 'Snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Medium rain showers',
    82: 'Voilent rain showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
};

async function getGeoData(cityName){
    try {
        const response = await fetch(`${API_URL_GEOCODING}&name=${cityName}`);
        const data = await response.json();
        cityNameElement.textContent = data.results[0].name + ', ' + data.results[0].country;
        console.log(data);
        console.log(data.results[0].country);
        return data.results[0];
    }
    catch (error){
        console.error('Error fetching geo-location data:', error);
        return null;
    }
}

async function getWeatherData(location) {
    try {
        const response = await fetch(`${API_URL_WEATHER}&latitude=${location.latitude}&longitude=${location.longitude}`);
        const data = await response.json();
        console.log('Weather Data Response:', data);
        return data;
    }
    catch (error){
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function updateWeatherDisplay(weather) {

    const temperature = weather.current.temperature_2m;
    const description = getWeatherDescription(weather.current.weather_code);
  
    // Update the content of the selected elements
    temperatureElement.textContent = temperature + '°C';
    descriptionElement.textContent = description;

    // Get the weather icon URL
    const currentWeatherIcon = getWeatherIcon(weather.current.weather_code);
    iconElement.src = currentWeatherIcon;
  
    // Update the daily forecast information
    const dailyForecastData = weather.daily;
  
    // Clear existing content in the daily forecast element
    dailyForecastElement.innerHTML = '';
  
    // Iterate over each day in the forecast data
    dailyForecastData.time.forEach((day, index) => {
        const date = new Date(day);
        // Inside the loop where you create daily forecast items
        const dayElement = document.createElement('section');
        dayElement.classList.add('daily-forecast-item');

        // Create separate paragraphs for each piece of information
        const dateParagraph = document.createElement('p');
        dateParagraph.textContent = date.toDateString();
        dateParagraph.classList.add('date');

        const maxTemperatureParagraph = document.createElement('p');
        maxTemperatureParagraph.textContent = 'Max ' + dailyForecastData.temperature_2m_max[index] + '°C';
        maxTemperatureParagraph.classList.add('max-temperature');

        const minTemperatureParagraph = document.createElement('p');
        minTemperatureParagraph.textContent = 'Min ' + dailyForecastData.temperature_2m_min[index] + '°C';
        minTemperatureParagraph.classList.add('min-temperature');

        const precipitationParagraph = document.createElement('p');
        precipitationParagraph.textContent = 'Precipitation ' + dailyForecastData.precipitation_sum[index] + 'mm';
        precipitationParagraph.classList.add('precipitation');

        // Create an img element for the daily forecast icon
        const iconElement = document.createElement('img');
        iconElement.classList.add('daily-weather-icon');

        // Get the weather icon URL for the daily forecast
        const dailyForecastIcon = getWeatherIcon(dailyForecastData.weather_code[index], false);
        iconElement.src = dailyForecastIcon;

        // Append paragraphs to the daily forecast item
        dayElement.appendChild(dateParagraph);
        dayElement.appendChild(iconElement);
        dayElement.appendChild(maxTemperatureParagraph);
        dayElement.appendChild(minTemperatureParagraph);
        dayElement.appendChild(precipitationParagraph);

        // Append the daily forecast item to the daily forecast container
        dailyForecastElement.appendChild(dayElement);
    });
}

function getWeatherDescription(weatherCode) {

    // Return the description for the given weather code, default to 'Unknown'
    return descriptions[weatherCode] || 'Unknown';
}

function getWeatherIcon(weatherCode, isCurrentWeather = true) {
    // Assuming that you have icons for different weather conditions
    const description = descriptions[weatherCode];

   if (isCurrentWeather) {
    switch (description) {
        case 'Clear sky':
            return './icons/sun.gif';
        case 'Mainly clear','Partly cloudy':
            return './icons/cloudy.gif';
        case 'Overcast':
            return './icons/clouds.gif';
        case 'Fog', 'Depositing rime fog':
            return './icons/foggy.gif'
        case 'Light drizzle', 'Moderate drizzle','Dense drizzle':
            return './icons/drizzle.gif';
        case 'Light freezing drizzle','Dense freezing drizzle','Light freezing rain','heavy freezing rain':
            return './icons/freezing-drizzle.gif';
        case 'Thunderstorm','Thunderstorm with hail','Thunderstorm with heavy hail':
            return './icons/Thunderstorm.gif';
        case 'Light rain shower':
            return './icons/lightRain.gif';
        case 'Rain showers','Rain shower','Heavy rain shower','Medium rain showers','Voilent rain showers':
            return './icons/heavyRain.gif';
        case 'Snow fall','Moderate snow fall','Heavy snow fall', 'Snow showers','Heavy snow showers':
            return './icons/snow.gif';
        case 'Snow grains':
            return './icons/snowgrains.gif';
        default:
            return './icons/cloud.gif';
    }
} else {
    // For daily forecast, use PNG icons
    switch (description) {
        case 'Clear sky':
            return './icons/sun-sky.png';
        case 'Mainly clear','Partly cloudy':
            return './icons/clear-sky.png';
        case 'Rain showers','Heavy rain shower','Medium rain showers','Voilent rain showers':
            return './icons/rainsky.png';
        case 'Overcast':
            return './icons/cloudy-sky.png';
        case 'Fog', 'Depositing rime fog':
            return './icons/fog-sky.png';
        case 'Light drizzle', 'Moderate drizzle','Dense drizzle':
            return './icons/drizzle-sky.png';
        case 'Light freezing drizzle','Dense freezing drizzle','Light freezing rain','heavy freezing rain':
            return './icons/freezing-sky.png';
        case 'Thunderstorm','Thunderstorm with hail','Thunderstorm with heavy hail':
            return './icons/thunderstorm-sky.png';
        case 'Snow fall','Moderate snow fall','Heavy snow fall', 'Snow showers','Heavy snow showers','Snow grains':
            return './icons/snow-sky.png';
        default:
            return './icons/cloudy-sky.png';
    }
}
}

async function startWeatherApp(){
    const getCityInput = document.querySelector('#cityName').value;

    const geo = await getGeoData(getCityInput);

    // Check if geo-location data is available
    if (geo) {
        const weather = await getWeatherData(geo);

        // Update the HTML elements with weather information
        updateWeatherDisplay(weather);
        document.getElementById('daily-forecast').style.display = 'flex';
         // Select all elements with the class 'daily-forecast-item'
        const forecastItems = document.querySelectorAll('.daily-forecast-item');

         // Loop through each item and set its display style
        forecastItems.forEach(item => {
             item.style.display = 'flex';
         });
    } else {
        console.error('Error fetching geo-location data');
    }
}

inputField.addEventListener('keyup', (event) => {
    if (event.code === "Enter") {
        event.preventDefault();
        startWeatherApp()
    }
})
buttonSubmitCity.addEventListener('click', (event) => {
    event.preventDefault();
    startWeatherApp();
})



// TODO: Use an api to get the weather data for at least the next 5 days


