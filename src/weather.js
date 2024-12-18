// Fetch coordinates using the Geocoding API
const fetchCoordinates = async () => {
    const geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct"; // Geocoding API endpoint
    const city = "Oklahoma City"; // City name
    const state = "OK"; // State abbreviation (specific to the US)
    const country = "US"; // Country code in ISO 3166 format
    const apiKey = "21d48ceb9e9626a3582feb6e8307bbc2"; // OpenWeatherMap API key

    try {
        // Make a request to the Geocoding API with the specified location
        const response = await fetch(`${geoApiUrl}?q=${city},${state},${country}&appid=${apiKey}`);

        // Check if the response is successful
        if (!response.ok) throw new Error("Failed to fetch coordinates");

        // Parse the JSON response
        const data = await response.json();

        // Check if any data was returned (e.g., if the location exists)
        if (data.length === 0) throw new Error("Location not found");

        // Return the latitude and longitude of the location
        return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
        // Log any errors encountered during the API call
        console.error("Error fetching coordinates:", error);
        return null; // Return null if an error occurs
    }
};

// Fetch weather data using the Weather API
const fetchWeather = async (lat, lon) => {
    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather"; // Weather API endpoint
    const apiKey = "21d48ceb9e9626a3582feb6e8307bbc2"; // OpenWeatherMap API key
    const units = "metric"; // Use metric units for temperature (Celsius)

    try {
        // Make a request to the Weather API using the given latitude and longitude
        const response = await fetch(`${weatherApiUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);

        // Check if the response is successful
        if (!response.ok) throw new Error("Failed to fetch weather data");

        // Parse the JSON response
        const data = await response.json();

        // Return a structured object containing weather details
        return {
            city: data.name, // City name
            temperature: data.main.temp, // Current temperature
            description: data.weather[0].description, // Weather condition description
            humidity: data.main.humidity, // Humidity percentage
            windSpeed: data.wind.speed, // Wind speed in m/s
        };
    } catch (error) {
        // Log any errors encountered during the API call
        console.error("Error fetching weather data:", error);
        return null; // Return null if an error occurs
    }
};

// Update the HTML with weather data
const updateWeatherUI = (weather) => {
    const weatherElement = document.getElementById("weather-info"); // Select the weather display element

    // Handle case where no weather data is available
    if (!weather) {
        weatherElement.textContent = "Unable to load weather data.";
        return;
    }

    // Update the weather display with dynamic data
    weatherElement.innerHTML = `
        <strong>City:</strong> ${weather.city} <br>
        <strong>Temperature:</strong> ${weather.temperature}°C <br>
        <strong>Condition:</strong> ${weather.description.charAt(0).toUpperCase() + weather.description.slice(1)} <br>
        <strong>Humidity:</strong> ${weather.humidity}% <br>
        <strong>Wind Speed:</strong> ${weather.windSpeed} m/s
    `;
};

// Main function to orchestrate the API calls and update UI
const loadWeather = async () => {
    // Fetch coordinates for the location
    const coordinates = await fetchCoordinates();

    // If coordinates are successfully fetched, retrieve weather data
    if (coordinates) {
        const weather = await fetchWeather(coordinates.lat, coordinates.lon);
        updateWeatherUI(weather); // Update the UI with the weather data
    } else {
        // If no coordinates are found, update the UI with an error message
        updateWeatherUI(null);
    }
};

// Load weather data when the page content is fully loaded
document.addEventListener("DOMContentLoaded", loadWeather);
