import { ScrollView, View, Text } from "react-native";
import { observer } from "mobx-react-lite";
import { model } from "../model.js";

// import { ProfilePresenter } from "../presenters/ProfilePresenter.jsx"  // create this ltr on

export default observer(function ProfilePage() {
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {/* just put some mock data here first */}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>User Profile</Text>
        <Text>Update personal particulars here.</Text>
        {/* <ProfilePresenter model={model} /> */}
      </View>
    </ScrollView> 
  );
});