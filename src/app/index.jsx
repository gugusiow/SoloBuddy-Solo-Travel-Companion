import { ScrollView, View } from "react-native";
import { observer } from "mobx-react-lite";
import { model } from "../model.js";

import HomePresenter from "../presenters/homePresenter.jsx";

export default observer(function ExplorePage() {
  return (
    <ScrollView>
      <View>
        <HomePresenter model={model} />
      </View>
    </ScrollView> 
  );
});