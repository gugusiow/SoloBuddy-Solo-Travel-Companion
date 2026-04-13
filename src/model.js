import { makeAutoObservable } from "mobx";
import { resolvePromise } from "./resolvePromise.js";
import { fetchWeatherBannerACB, fetchWeatherDetailsACB, buildWeatherAlertsACB } from "./services/weatherService.js";
import { enrichAttractionsWithCoordinates } from "./services/googleMapsService.js";

class AppModel {
  // keep this static data for now
  attractions = [
    { id: 1, name: "Eiffel Tower", location: "Paris, France", safetyRating: 4.2, latitude: 48.8584, longitude: 2.2945 },
    { id: 2, name: "Colosseum", location: "Rome, Italy", safetyRating: 3.8, latitude: 41.8902, longitude: 12.4922 },
    { id: 3, name: "Vasa Museum", location: "Stockholm, Sweden", safetyRating: 5.0, latitude: 59.3275, longitude: 18.0914 },
    { id: 4, name: "Louvre Museum", location: "Paris, France", safetyRating: 4.2, latitude: 48.8606, longitude: 2.3376 },
    { id: 5, name: "Basílica de la Sagrada Família", location: "Barcelona, Spain", safetyRating: 4.0, latitude: 41.4036, longitude: 2.1744 },
  ];

  // promise states for async data
  weatherBannerPromiseState = {};
  weatherDetailsPromiseState = {};
  attractionsPromiseState = {};

  // weather alerts derived from weather data
  weatherAlerts = [];

  // news and safety data? 
  touristNews = [];

  // auth state
  currentUser = null;
  profile = null;
  ready = false;

  // user's current device location { latitude, longitude } or null
  currentLocation = null;

  // loading state
  loadingStatus = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // --- weather ---
  fetchWeatherBanner(lat, lng) {
    resolvePromise(fetchWeatherBannerACB(lat, lng), this.weatherBannerPromiseState);
  }

  fetchWeatherDetails(lat, lng) {
    resolvePromise(fetchWeatherDetailsACB(lat, lng), this.weatherDetailsPromiseState);
  }

  updateWeatherAlerts() {
    const weather = this.weatherDetailsPromiseState.data || this.weatherBannerPromiseState.data;
    const alerts = buildWeatherAlertsACB(weather);
    this.weatherAlerts = alerts.length > 0
      ? alerts
      : [{ event: "No major local incidents reported", description: "No robbery, accident, earthquake, or severe weather alert is currently flagged for your area." }];
  }

  // --- attractions ---
  fetchAttractions(baseAttractions) {
    resolvePromise(enrichAttractionsWithCoordinates(baseAttractions), this.attractionsPromiseState);
  }

  // setter
  setLoading(status) {
    this.loadingStatus = status;
  }

  setWeatherAlerts(alerts) {
    this.weatherAlerts = alerts;
  }

  setTouristNews(news) {
    this.touristNews = news;
  } 

  setCurrentUser(user) {
    this.currentUser = user;
  }

  setProfile(profile) {
    this.profile = profile;
  }

  clearProfile() {
    this.profile = null;
  }

  resetUserState() {
    this.currentUser = null;
    this.profile = null;
  }

  setReady(status) {
    this.ready = status;
  }

  setCurrentLocation(location) {
    this.currentLocation = location;
  }
}

export const model = new AppModel();