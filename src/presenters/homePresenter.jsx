import { HomeView } from "/src/native-views/homeView.jsx"

export default function HomePresenter(props) {
    return (
        <HomeView
            attractions={props.model.attractions}
        />
    )
}
