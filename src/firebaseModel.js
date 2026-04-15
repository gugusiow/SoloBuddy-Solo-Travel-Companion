import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { firebaseConfig } from "/src/firebaseConfig.js";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let unsubscribeProfile = null;

export function connectToAuth(model) {
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }

    if (user) {
      model.setCurrentUser({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
      });

      const profileRef = doc(db, "users", user.uid);

      unsubscribeProfile = onSnapshot(
        profileRef,
        async (snapshot) => {
          if (snapshot.exists()) {
            model.setProfile(snapshot.data());
          } else {
            const starterProfile = {
              email: user.email || "",
              name: user.displayName || "",
              birthday: "",
              phone: user.phoneNumber || "",
              avatarUrl: user.photoURL || "",
              wishlist: [],
              visitedPlaces: [],
              createdAt: serverTimestamp(),
            };

            await setDoc(profileRef, starterProfile);
            model.setProfile({
              ...starterProfile,
              createdAt: null,
            });
          }
        },
        (error) => {
          console.error("Error listening to profile:", error);
          model.clearProfile();
        }
      );
    } else {
      model.resetUserState();
    }

    if (!model.ready) {
      model.setReady(true);
    }
  });

  return function cleanup() {
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }
    unsubscribeAuth();
  };
}

export async function signUpWithEmail(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCredential.user.uid), {
    email: userCredential.user.email || "",
    name: "",
    birthday: "",
    phone: "",
    avatarUrl: "",
    wishlist: [],
    visitedPlaces: [],
    createdAt: serverTimestamp(),
  });

  return userCredential;
}

// sign in an existing user with email and password
export function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// sign out the current user
export function signOutUser() {
  return signOut(auth);
}

export function saveUserProfile(uid, profilePatch) {
  return setDoc(doc(db, "users", uid), profilePatch, { merge: true });
}

// func to upload photo
export async function uploadProfilePhoto(uri, uid) {
  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(storage, `users/${uid}/profile-photo-${Date.now()}.jpg`);

  await uploadBytes(imageRef, blob, { contentType: "image/jpeg" });

  const downloadURL = await getDownloadURL(imageRef);

  await saveUserProfile(uid, { avatarUrl: downloadURL });

  return downloadURL;
}

// add or replace one wishlist item (use attraction.id as the doc id)
export function setWishlistItem(uid, item) {
  const ref = doc(db, "users", uid, "wishlist", item.id);
  return setDoc(ref, { ...item, createdAt: serverTimestamp() });
}

// remove wishlist item
export function removeWishlistItem(uid, itemId) {
  const ref = doc(db, "users", uid, "wishlist", itemId);
  return deleteDoc(ref);
}

let unsubscribeWishlist = null;
export function listenToWishlist(uid, onUpdate) {
  if (unsubscribeWishlist) {
    unsubscribeWishlist();
    unsubscribeWishlist = null;
  }
  const q = query(collection(db, "users", uid, "wishlist"), orderBy("createdAt", "desc"));
  unsubscribeWishlist = onSnapshot(
    q,
    (snap) => {
      const items = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      onUpdate(items);
    },
    (err) => {
      console.error("wishlist listener error", err);
      onUpdate([]);
    }
  );
  return () => {
    if (unsubscribeWishlist) {
      unsubscribeWishlist();
      unsubscribeWishlist = null;
    }
  };
}