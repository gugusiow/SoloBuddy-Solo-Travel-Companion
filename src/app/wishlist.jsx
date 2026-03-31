import { ScrollView, View, Text } from "react-native";
import { observer } from "mobx-react-lite";
import { model } from "../model.js";

// import { WishlistPresenter } from "../presenters/wishlistPresenter.jsx"  // import ltr when the file is made

export default observer(function WishlistPage() {
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>My Itinerary</Text>
        <Text>Your saved attractions will appear here.</Text>
        {/* <WishlistPresenter model={model} /> */}
      </View>
    </ScrollView> 
  );
});