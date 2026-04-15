import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import WishlistView from "../native-views/wishlistView.jsx";
import { listenToWishlist, removeWishlistItem } from "../firebaseModel.js";

export const WishlistPresenter = observer(function WishlistPresenter({ model }) {
  useEffect(
    function subscribeWishlistACB() {
      if (!model.currentUser?.uid) {  // if logged out, clear the wishlist, dont wwanna see other stuff
        model.setWishlist([]);
        return;
      }
      
      // keep the local wishlist in sync with Firestore for the logged-in user
      return listenToWishlist(model.currentUser.uid, function onWishlistUpdateACB(items) {
        model.setWishlist(items);
      });
    },
    [model, model.currentUser?.uid]
  );

  // ACB to remove an item from firestore listener updates the UI automatically
  async function removeItemACB(itemId) {
    if (!model.currentUser?.uid || !itemId) {
      return;
    }

    await removeWishlistItem(model.currentUser.uid, itemId);
  }

  // load the current wishlist items from the mdoel
  const items = model.wishlist || [];
  return <WishlistView items={items} onRemoveItem={removeItemACB} />;
});

export default WishlistPresenter;
