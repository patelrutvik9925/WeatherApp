// get all element that we need it.
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");

const cityName = document.querySelector("#city-name");
const weatherDescription = document.querySelector("#weather-description");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");

const notification = document.querySelector("#notification");

// create funtions

function showNotification(message){
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
    cityInput.value = "";
}

function getWeatherDescription(code){
    switch(code){
        case 0 : return "☀️ Clear Sky";
        case 1 : return "🌤️ Mainly Clear";
        case 2 : return "⛅ Partly Cloudy";
        case 3 : return "☁️ Overcast";
        default : return "🌍 Unknown Weather";
    }
}

async function getWeather(city,latitude,longitude) {
    try{
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        const response = await fetch(url);
        const data = await response.json();
        cityInput.value = "";
        cityName.textContent = city;
        weatherDescription.textContent = getWeatherDescription(data.current.weather_code);
        temperature.textContent = `🌡️ Temperature: ${data.current.temperature_2m}°C`;
        humidity.textContent = `💧 Humidity: ${data.current.relative_humidity_2m}%`;
        windSpeed.textContent = `🌬️ Wind Speed: ${data.current.wind_speed_10m} km/h`;
    }
    catch(error){
        showNotification("Unable to fetch weather data.");
    }
}

// add eventlisteners

searchBtn.addEventListener("click",async ()=>{
    const city = cityInput.value.trim();
    if(city === ""){
        showNotification("Please enter a city name.");
        return;
    }
    try{
        const geoUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        if(!geoData.results || geoData.results.length === 0){
           throw new Error("City not found");
        }
        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        await getWeather(city,latitude,longitude);
    }catch(error){ 
        showNotification("Unable to find the city. Please enter a valid city name.");
    }
});