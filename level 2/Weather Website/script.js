"use strict";
// HTML ELEMENTS
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const statusMessage = document.getElementById("status-message");
const currentWeather = document.getElementById("current-weather");
const forecastSection = document.getElementById("forecast-section");
const forecastContainer = document.getElementById("forecast-container");
const welcomeSection = document.getElementById("welcome-section");
const cityNameElement = document.getElementById("city-name");
const currentDateElement = document.getElementById("current-date");
const temperatureElement = document.getElementById("temperature");
const weatherConditionElement = document.getElementById("weather-condition");
const weatherIconElement = document.getElementById("weather-icon");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const feelsDetailElement = document.getElementById("feels-detail");

// Open-Meteo API endpoints.
const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";

//weather codes into descriptions and emojis.

function getWeatherInfo(code, isDay = 1) {
    const weatherTypes = {
        0: {
            description: "Clear sky",
            dayIcon: "☀️",
            nightIcon: "🌙"
        },
        1: {
            description: "Mainly clear",
            dayIcon: "🌤️",
            nightIcon: "🌙"
        },
        2: {
            description: "Partly cloudy",
            dayIcon: "⛅",
            nightIcon: "☁️"
        },
        3: {
            description: "Overcast",
            dayIcon: "☁️",
            nightIcon: "☁️"
        },
        45: {
            description: "Fog",
            dayIcon: "🌫️",
            nightIcon: "🌫️"
        },
        48: {
            description: "Rime fog",
            dayIcon: "🌫️",
            nightIcon: "🌫️"
        },
        51: {
            description: "Light drizzle",
            dayIcon: "🌦️",
            nightIcon: "🌧️"
        },
        53: {
            description: "Moderate drizzle",
            dayIcon: "🌦️",
            nightIcon: "🌧️"
        },
        55: {
            description: "Dense drizzle",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        56: {
            description: "Light freezing drizzle",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        57: {
            description: "Dense freezing drizzle",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        61: {
            description: "Slight rain",
            dayIcon: "🌦️",
            nightIcon: "🌧️"
        },
        63: {
            description: "Moderate rain",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        65: {
            description: "Heavy rain",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        66: {
            description: "Light freezing rain",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        67: {
            description: "Heavy freezing rain",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        71: {
            description: "Slight snowfall",
            dayIcon: "🌨️",
            nightIcon: "🌨️"
        },
        73: {
            description: "Moderate snowfall",
            dayIcon: "🌨️",
            nightIcon: "🌨️"
        },
        75: {
            description: "Heavy snowfall",
            dayIcon: "❄️",
            nightIcon: "❄️"
        },
        77: {
            description: "Snow grains",
            dayIcon: "❄️",
            nightIcon: "❄️"
        },
        80: {
            description: "Slight rain showers",
            dayIcon: "🌦️",
            nightIcon: "🌧️"
        },
        81: {
            description: "Moderate rain showers",
            dayIcon: "🌧️",
            nightIcon: "🌧️"
        },
        82: {
            description: "Violent rain showers",
            dayIcon: "⛈️",
            nightIcon: "⛈️"
        },
        85: {
            description: "Slight snow showers",
            dayIcon: "🌨️",
            nightIcon: "🌨️"
        },
        86: {
            description: "Heavy snow showers",
            dayIcon: "❄️",
            nightIcon: "❄️"
        },
        95: {
            description: "Thunderstorm",
            dayIcon: "⛈️",
            nightIcon: "⛈️"
        },
        96: {
            description: "Thunderstorm with slight hail",
            dayIcon: "⛈️",
            nightIcon: "⛈️"
        },
        99: {
            description: "Thunderstorm with heavy hail",
            dayIcon: "⛈️",
            nightIcon: "⛈️"
        }
    };
    return weatherTypes[code] || {
        description: "Weather unavailable",
        dayIcon: "🌡️",
        nightIcon: "🌡️"
    };
}

function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "status-message";

    if (type) {
        statusMessage.classList.add(type);
    }

    statusMessage.hidden = false;
}
function hideStatus() {
    statusMessage.hidden = true;
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}

function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    cityInput.disabled = isLoading;

    searchButton.textContent = isLoading
        ? "Searching..."
        : "Search";

    searchForm.setAttribute("aria-busy", String(isLoading));
}
//FETCH DATA SAFELY
async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Weather service returned an error (${response.status}).`
        );
    }

    return await response.json();
}
//FIND CITY COORDINATES


async function getCityCoordinates(city) {
    const params = new URLSearchParams({
        name: city,
        count: "10",
        language: "en",
        format: "json"
    });

    const data = await fetchJSON(
        `${GEOCODING_API}?${params.toString()}`
    );

    if (!data.results || data.results.length === 0) {
        throw new Error(
            `We couldn't find "${city}". Please check the spelling and try again.`
        );
    }

    // Prefer larger, populated places when multiple matches exist.
    const results = [...data.results].sort(
        (a, b) => (b.population || 0) - (a.population || 0)
    );

    const place = results[0];

    return {
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        country: place.country || "",
        region: place.admin1 || "",
        timezone: place.timezone || "auto"
    };
}

// FETCH CURRENT WEATHER AND FORECAST

async function getWeatherData(location) {
    const params = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,

        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m",
            "is_day"
        ].join(","),

        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min"
        ].join(","),

        forecast_days: "6",
        timezone: location.timezone,
        temperature_unit: "celsius",
        wind_speed_unit: "kmh"
    });

    const data = await fetchJSON(
        `${WEATHER_API}?${params.toString()}`
    );

    if (!data.current || !data.daily) {
        throw new Error(
            "Weather information is currently unavailable for this location."
        );
    }

    return data;
}
//FORMAT DATES

function formatCurrentDate(dateString, timezone) {
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function formatForecastDay(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-IN", {
        weekday: "short"
    }).format(date);
}
//DISPLAY CURRENT WEATHER

function displayCurrentWeather(location, data) {
    const current = data.current;

    const info = getWeatherInfo(
        current.weather_code,
        current.is_day
    );

    const locationParts = [
        location.name,
        location.region,
        location.country
    ].filter(Boolean);

    const uniqueLocationParts = locationParts.filter(
        (part, index) => locationParts.indexOf(part) === index
    );

    cityNameElement.textContent = uniqueLocationParts.join(", ");

    currentDateElement.textContent = formatCurrentDate(
        current.time,
        location.timezone
    );

    temperatureElement.textContent =
        `${Math.round(current.temperature_2m)}°`;

    weatherConditionElement.textContent = info.description;

    weatherIconElement.textContent =
        current.is_day
            ? info.dayIcon
            : info.nightIcon;

    weatherIconElement.setAttribute(
        "aria-label",
        info.description
    );

    const feelsLike = Math.round(current.apparent_temperature);

    feelsLikeElement.textContent = `Feels like ${feelsLike}°C`;
    feelsDetailElement.textContent = `${feelsLike}°C`;

    humidityElement.textContent =
        `${current.relative_humidity_2m}%`;

    windSpeedElement.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    currentWeather.hidden = false;
    welcomeSection.hidden = true;
}
// DISPLAY FIVE-DAY FORECAST

function displayForecast(data) {
    const daily = data.daily;

    if (!daily.time || daily.time.length < 2) {
        throw new Error(
            "The forecast is currently unavailable. Please try again."
        );}

    forecastContainer.replaceChildren();

    const forecastDays = daily.time.slice(1, 6);

    forecastDays.forEach((date, index) => {
        const apiIndex = index + 1;

        const weatherInfo = getWeatherInfo(
            daily.weather_code[apiIndex],
            1
        );

        const card = document.createElement("article");
        card.className = "forecast-card";

        const day = document.createElement("p");
        day.className = "forecast-day";
        day.textContent = formatForecastDay(date);

        const icon = document.createElement("span");
        icon.className = "forecast-icon";
        icon.textContent = weatherInfo.dayIcon;
        icon.setAttribute("role", "img");
        icon.setAttribute("aria-label", weatherInfo.description);

        const condition = document.createElement("p");
        condition.className = "forecast-condition";
        condition.textContent = weatherInfo.description;

        const temperatures = document.createElement("div");
        temperatures.className = "forecast-temperatures";

        const maxTemp = document.createElement("span");
        maxTemp.className = "forecast-max";
        maxTemp.textContent =
            `${Math.round(daily.temperature_2m_max[apiIndex])}°`;

        const minTemp = document.createElement("span");
        minTemp.className = "forecast-min";
        minTemp.textContent =
            `${Math.round(daily.temperature_2m_min[apiIndex])}°`;

        temperatures.append(maxTemp, minTemp);
        card.append(day, icon, condition, temperatures);
        forecastContainer.appendChild(card);
    });

    forecastSection.hidden = false;
}
let searchRequestId = 0;
async function searchWeather(city) {
    const requestId = ++searchRequestId;
    setLoading(true);
    showStatus("Fetching the latest weather information...", "loading");
    try {
        const location = await getCityCoordinates(city);

        if (requestId !== searchRequestId) {
            return;
        }

        const data = await getWeatherData(location);

        if (requestId !== searchRequestId) {
            return;
        }

        displayCurrentWeather(location, data);
        displayForecast(data);

        showStatus(
            `Weather updated successfully for ${location.name}.`,
            "success"
        );

        window.setTimeout(() => {
            if (requestId === searchRequestId) {
                hideStatus();
            }
        }, 2500);

    } catch (error) {
        if (requestId !== searchRequestId) {
            return;
        }

        console.error("Weather search failed:", error);

        if (error instanceof TypeError) {
            showStatus(
                "Unable to connect to the weather service. Check your internet connection and try again.",
                "error"
            );
        } else {
            showStatus(
                error.message ||
                "Something went wrong. Please try again.",
                "error"
            );
        }
    } finally {
        if (requestId === searchRequestId) {
            setLoading(false);
        } }}
//HANDLE FORM SUBMISSION
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
        showStatus(
            "Please enter a city name before searching.",
            "error"
        );
        cityInput.focus();
        return;
    }
    searchWeather(city);
});