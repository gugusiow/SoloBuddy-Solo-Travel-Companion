// const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const GOOGLE_WEATHER_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

async function fetchJsonACB(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function fetchCurrentWeatherACB(latitude, longitude) {
  const url =
    "https://weather.googleapis.com/v1/currentConditions:lookup" +
    `?key=${GOOGLE_WEATHER_API_KEY}` +
    `&location.latitude=${latitude}` +
    `&location.longitude=${longitude}`;

  return fetchJsonACB(url, "Failed to fetch current weather conditions.");
}

export async function fetchDailyForecastACB(latitude, longitude) {
  const url =
    "https://weather.googleapis.com/v1/forecast/days:lookup" +
    `?key=${GOOGLE_WEATHER_API_KEY}` +
    `&location.latitude=${latitude}` +
    `&location.longitude=${longitude}` +
    "&days=1";

  return fetchJsonACB(url, "Failed to fetch daily weather forecast.");
}

export async function fetchWeatherBannerACB(latitude, longitude) {
  const [currentData, dailyData] = await Promise.all([
    fetchCurrentWeatherACB(latitude, longitude),
    fetchDailyForecastACB(latitude, longitude),
  ]);

  const today = dailyData.forecastDays?.[0];

  return {
    temperature: Math.round(currentData.temperature?.degrees ?? 0),
    unit: currentData.temperature?.unit === "FAHRENHEIT" ? "F" : "C",
    condition:
      currentData.weatherCondition?.description?.text ?? "Unknown conditions",
    high: Math.round(today?.maxTemperature?.degrees ?? 0),
    low: Math.round(today?.minTemperature?.degrees ?? 0),
    isDaytime: currentData.isDaytime ?? true,
    iconBaseUri: currentData.weatherCondition?.iconBaseUri ?? null,
  };
}

export function buildWeatherAlertsACB(weather) {
  if (!weather?.condition) {
    return [];
  }

  const condition = weather.condition.toLowerCase();
  const alerts = [];

  if (
    condition.includes("storm") ||
    condition.includes("thunder") ||
    condition.includes("snow") ||
    condition.includes("ice")
  ) {
    alerts.push({
      event: "Weather warning",
      description: `Current conditions: ${weather.condition}. Allow extra travel time and use caution outdoors.`,
    });
  }

  if (condition.includes("rain") || condition.includes("showers")) {
    alerts.push({
      event: "Wet conditions",
      description:
        "Bring rain protection and expect slippery streets in exposed walking areas.",
    });
  }

  return alerts;
}