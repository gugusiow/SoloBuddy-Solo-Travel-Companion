# ID2216 Group 10 Project: SoloBuddy (Travel Safety Companion App)

---

## 1. Short Description

SoloBuddy is a Travel Safety Companion App targeted at solo-travellers. The main use of the app is to alert the user of potential dangers in the area they are travelling in/intend to travel to. Important data like safety/crime-levels, rampant pickpocketing, or even natural disasters will be provided to users, along with tips for a safe solo travel experience.

---

## 2. What We Have Done

We have set up the basic structure of our app, with user authentication and 4 separate tabs (Explore, Community, Wishlist and Profile). Although the tabs are created, not all of the pages are done up yet. There is a login/register page for users to enter credentials.

In the app, the Explore tab has most of the focus, with a weather banner that users can tap on to open a modal window for more details. There is also a map, which we intend to use to show danger-alerts in the area along with some tourist attractions. Next, since this is also a travel app, we have a carousel of attractions (static atm, but intend to make it dynamically load depending on location) which users can tap "see more" to get more info. Further down, there is a "News" section which we intend to make it so important local news will appear (static data at the moment).

In the profile tab, user's can edit their information like email and contact number and in the future upload profile pics (still buggy at the moment).

---

## 3. What We Still Plan to Do

- Add more functionality to the map, to be able to search for specific locations, tap on them and add to wishlist.
- Fully implement the safety data, like danger-level of each city (i.e. crime-level, accidents, etc), get local attractions and get local news.
- Implement the wishlist tab, so users can keep track of places they want to go. Perhaps can keep track of places they've been to as well.
- Attempt to implement the social aspect of the app (community tab) where users can post and share travel safety tips/reviews on the safety of places they've been to. (but this might be very hard)

---

## 4. Project File Structure

```
.
├── .env                              # local environment variables (not committed)
├── .env.example                      # template showing required environment variable keys
└── src/
    ├── firebaseConfig.js             : Firebase project configuration (API keys, initialization)
    ├── firebaseModel.js              : helper functions/models for interacting with Firebase (e.g., auth, database)
    ├── model.js                      : contains app-level data models and shared state shape
    ├── app/
    │   ├── _layout.jsx               : top-level layout/navigation wrapper for the app screens
    │   ├── index.jsx                 : the app's main screen
    │   ├── community.jsx             : community screen component
    │   ├── profile.jsx               : profile screen component
    │   └── wishlist.jsx              : wishlist screen component
    ├── native-views/
    │   ├── attractionCard.jsx        : card component to render an attraction item
    │   ├── attractionsMap.native.jsx : native (mobile) map view implementation for attractions
    │   ├── attractionsMap.web.jsx    : web-specific map view implementation (implemented this because one of our members had an issue with viewing the map on mobile device)
    │   ├── authView.jsx              : authentication UI (login/signup) view
    │   ├── homeView.jsx              : home screen UI component
    │   ├── homeView.styles.js        : styles for the home view, separate file coz there's a lot of styling
    │   ├── profileEditView.jsx       : UI for editing the user's profile
    │   └── profileView.jsx           : profile view
    ├── presenters/
    │   ├── authPresenter.jsx         : contains auth-related presentation logic
    │   ├── homePresenter.jsx         : home-screen presentation/business logic
    │   └── profilePresenter.jsx      : profile-related presentation logic
    └── services/
        ├── googleMapsService.js      : service for Google Maps API interactions
        └── weatherService.js         : weather API utilities that we use to fetch current weather, forecasts
```

---

## 5. Example API Call

To fetch current weather conditions, we send an HTTP GET request to:

```
https://weather.googleapis.com/v1/currentConditions:lookup?key=YOUR_API_KEY&location.latitude=LATITUDE&location.longitude=LONGITUDE
```

Request (from `weatherService.js`):

```js
async function fetchCurrentWeatherACB(latitude, longitude) {
  const url =
    "https://weather.googleapis.com/v1/currentConditions:lookup" +
    `?key=${GOOGLE_WEATHER_API_KEY}` +
    `&location.latitude=${latitude}` +
    `&location.longitude=${longitude}`;

  return fetchJsonACB(url, "Failed to fetch current weather conditions.");
}
```

Example response:

```json
{
  "isDaytime": true,
  "weatherCondition": {
    "iconBaseUri": "https://maps.gstatic.com/weather/v1/partly_cloudy",
    "description": {
      "text": "Partly cloudy",
      "languageCode": "en"
    }
  },
  "temperature": {
    "degrees": 12.0,
    "unit": "CELSIUS"
  },
  "feelsLikeTemperature": {
    "degrees": 9.1,
    "unit": "CELSIUS"
  },
  "relativeHumidity": 68,
  "uvIndex": 3,
  "wind": {
    "direction": { "degrees": 220, "cardinal": "SOUTHWEST" },
    "speed": { "value": 14, "unit": "KILOMETERS_PER_HOUR" }
  },
  "airQuality": { "universalAqi": 42 }
}
```

We use this data to populate the weather banner (temperature, condition, day/night icon) and the detail modal (feels like, humidity, wind speed, UV index).

---

