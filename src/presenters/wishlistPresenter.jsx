import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import WishlistView from "../native-views/wishlistView.jsx";
import { listenToWishlist, removeWishlistItem, markWishlistItemVisited } from "../firebaseModel.js";

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

  // load the current wishlist items from the model, split into active and visited
  const allItems = model.wishlist || [];
  const activeItems = allItems.filter((item) => !item.visited);
  const visitedItems = allItems.filter((item) => item.visited);
  const activeCount = activeItems.length;
  const canGenerate = activeCount >= 5;
  const itineraryState = {
    promise: model.itineraryPromiseState.promise,
    data: model.itineraryPromiseState.data,
    error: model.itineraryPromiseState.error,
  };

  // clear ai gen itinerary when active wishlist changes can be add/remove/visited
  // useEffect(
  //   function clearItineraryOnActiveCountChangeACB() {
  //     model.clearItinerary();
  //   },
  //   [model, activeCount]
  // );

  // ACB to remove an item from firestore listener updates the UI automatically
  async function removeItemACB(itemId) {
    if (!model.currentUser?.uid || !itemId) {
      return;
    }

    await removeWishlistItem(model.currentUser.uid, itemId);
  }

  // ACB to toggle visited state on a wishlist item
  async function markVisitedACB(itemId, visited) {
    if (!model.currentUser?.uid || !itemId) return;
    await markWishlistItemVisited(model.currentUser.uid, itemId, visited);
  }

  function generateItineraryACB() {
    model.generateItinerary();
  }

  return (
    <WishlistView
      activeItems={activeItems}
      visitedItems={visitedItems}
      activeCount={activeCount}
      canGenerate={canGenerate}
      itineraryState={itineraryState}
      onGenerateItinerary={generateItineraryACB}
      onRemoveItem={removeItemACB}
      onMarkVisited={markVisitedACB}
    />
  );
});

export default WishlistPresenter;
