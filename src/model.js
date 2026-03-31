import { makeAutoObservable } from "mobx";

class AppModel {
    // keep this static data for now
    attractions = [
        { id: 1, name: "Eiffel Tower", location: "Paris, France", safetyRating: 4.2 },
        { id: 2, name: "Colosseum", location: "Rome, Italy", safetyRating: 3.8 },
    ]
    
    // try to set up weather alert system
    weatherAlerts = [];
    loadingStatus = false;

    constructor() {
        makeAutoObservable(this);   // observe the variables, auto update UI if they change
    }

    // function to update laoding status
    setLoading(status) {
        console.log(`loadingStatus updated to -> ${status}`);
        this.loadingStatus = status;
    }

    // func to set weather alerts
    setWeatherAlerts(alerts) {
        console.log(`weatherAlerts updated! Found ${alerts.length} alerts.`);
        this.weatherAlerts = alerts;
    }
}

export const model = new AppModel();    // export an instance of the app model