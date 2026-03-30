import { ScrollView, View, Text } from "react-native";
import { observer } from "mobx-react-lite";
import { model } from "../model.js";

// import { CommunityPresenter } from "../presenters/communityPresenter.jsx"  // create this ltr on

export default observer(function CommunityPage() {
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {/* just put some mock data here first */}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Community & Vibes</Text>
        <Text>Read safety reviews, check crowd levels, and post your own experience.</Text>
        {/* <CommunityPresenter model={model} /> */}
      </View>
    </ScrollView> 
  );
});