import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseModel.js";

export function setWishlistItem(uid, item) {
  const ref = doc(db, "users", uid, "wishlist", item.id);
  return setDoc(ref, { ...item, visited: false, createdAt: serverTimestamp() });
}

export function markWishlistItemVisited(uid, itemId, visited) {
  const ref = doc(db, "users", uid, "wishlist", itemId);
  return updateDoc(ref, { visited });
}

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
