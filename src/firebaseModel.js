import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import { firebaseConfig } from "/src/firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// most of this code is copied from the firebase auth guide


// attach an auth state observer to the model
// when user signs in/out, model.currentUser and model.ready are updated
// Returns the unsubscribe for cleanup
export function connectToAuth(model) {
    const unsubscribe = onAuthStateChanged(auth, function onAuthStateChangedACB(user) {
        if (user) {
            // user is signed in — store only what we need
            model.setCurrentUser({ uid: user.uid, email: user.email });
        } else {
            // user is signed out
            model.setCurrentUser(null);
        }
        // mark the app as ready (auth state resolved for the first time)
        if (!model.ready) {
            model.setReady(true);
        }
    });
    return unsubscribe;
}

// sign up a new user with email and password
export function signUpWithEmail(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// sign in an existing user with email and password
export function signInWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// sign out the current user
export function signOutUser() {
    return signOut(auth);
}
