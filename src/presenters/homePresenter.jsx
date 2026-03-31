import { observer } from "mobx-react-lite";
import { HomeView } from "../native-views/homeView.jsx";

const HomePresenter = observer(function HomePresenter(props) {
  const model = props.model;

  async function userWantsToRefreshDataACB() {
    model.setLoading(true);
    
    try {
      // set an artificical delay
      await new Promise(function resolveAfterDelay(resolve) {
        setTimeout(resolve, 2000);
      });
      const mockAlerts = [{ event: "Heavy Rain", description: "Bring an umbrella!" }];
      model.setWeatherAlerts(mockAlerts);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      model.setLoading(false);
    }
  }

  return (
    <HomeView 
      attractions={model.attractions}
      loadingStatus={model.loadingStatus}
      weatherAlerts={model.weatherAlerts}
      onRefreshData={userWantsToRefreshDataACB}
    />
  );
});

export default HomePresenter;