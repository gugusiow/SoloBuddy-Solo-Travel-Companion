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

    // auth state — null means not logged in, object means logged in
    currentUser = null;
    // ready is false until onauthstatechanged fires for the first time (firebaseee)
    ready = false;

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

    // set the current logged-in user ({ uid, email } or null)
    setCurrentUser(user) {
        console.log(`currentUser updated to -> ${user ? user.email : "null"}`);
        this.currentUser = user;
    }

    // set ready (true once firebase auth state is resolved on app start)
    setReady(status) {
        console.log(`ready updated to -> ${status}`);
        this.ready = status;
    }
}

export const model = new AppModel();    // export an instance of the app model