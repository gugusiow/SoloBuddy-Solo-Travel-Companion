import { makeAutoObservable, configure } from "mobx";
configure({ enforceActions: "never" });
import { resolvePromise } from "./resolvePromise.js";
import { fetchWeatherBannerACB, fetchWeatherDetailsACB, buildWeatherAlertsACB } from "./services/weatherService.js";
import { fetchAttractionsACB, fetchPlaceDetailsACB } from "./services/placesService.js";
import { fetchNewsACB } from "./services/newsService.js";

class AppModel {
  // promise states for async data
  weatherBannerPromiseState = {};
  weatherDetailsPromiseState = {};
  attractionsPromiseState = {};
  placeDetailsPromiseState = {};

  // currently selected attraction
  currentAttraction = null;

  // weather alerts derived from weather data
  weatherAlerts = [];

  // news
  newsPromiseState = {};

  // auth state
  currentUser = null;
  profile = null;
  ready = false;

  // attraction wishlist
  wishlist = [];

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
  fetchAttractions(lat, lng) {
    resolvePromise(fetchAttractionsACB(lat, lng), this.attractionsPromiseState);
  }

  // --- news ---
  fetchNews(query) {
    resolvePromise(fetchNewsACB(query), this.newsPromiseState);
  }

  setCurrentAttraction(attraction) {
    this.currentAttraction = attraction;
  }

  fetchPlaceDetails(placeId) {
    resolvePromise(fetchPlaceDetailsACB(placeId), this.placeDetailsPromiseState);
  }

  clearPlaceDetails() {
    this.placeDetailsPromiseState.promise = null;
    this.placeDetailsPromiseState.data = null;
    this.placeDetailsPromiseState.error = null;
  }

  // setter
  setLoading(status) {
    this.loadingStatus = status;
  }

  setWeatherAlerts(alerts) {
    this.weatherAlerts = alerts;
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

  // set wishlist to replace current items
  setWishlist(items) {
    this.wishlist = Array.isArray(items) ? items : [];
  }
}

export const model = new AppModel();