import { makeAutoObservable } from "mobx";

class AppModel {
  // keep this static data for now
  attractions = [
    { id: 1, name: "Eiffel Tower", location: "Paris, France", safetyRating: 4.2, latitude: 48.8584, longitude: 2.2945 },
    { id: 2, name: "Colosseum", location: "Rome, Italy", safetyRating: 3.8, latitude: 41.8902, longitude: 12.4922 },
    { id: 3, name: "Vasa Museum", location: "Stockholm, Sweden", safetyRating: 5.0, latitude: 59.3275, longitude: 18.0914 },
    { id: 4, name: "Louvre Museum", location: "Paris, France", safetyRating: 4.2, latitude: 48.8606, longitude: 2.3376 },
    { id: 5, name: "Basílica de la Sagrada Família", location: "Barcelona, Spain", safetyRating: 4.0, latitude: 41.4036, longitude: 2.1744 },
  ];

  // try to set up weather alert system
  weatherAlerts = [];
  loadingStatus = false;

  // auth state
  currentUser = null;
  profile = null;
  ready = false;

  // user's current device location { latitude, longitude } or null
  currentLocation = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

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
}

export const model = new AppModel();