import { Tabs } from "expo-router"
import { Text } from "react-native"
import { model } from "../model.js"
import { observer } from "mobx-react-lite";

export default observer(function RootLayout() {
    // if (!model.ready) { return <Text>Loading...</Text>;}

    return (
        <Tabs>
            <Tabs.Screen 
                name="index" 
                options={{
                title: "Explore",
                tabBarIcon: function renderExploreTabIconACB() {
                    return <Text>🗺️</Text>;
                },
                }}
            />
            
            <Tabs.Screen 
                name="community" 
                options={{
                title: "Community",
                tabBarIcon: function renderCommunityTabIconACB() {
                    return <Text>💬</Text>;
                },
                }}
            />

            <Tabs.Screen 
                name="wishlist" 
                options={{
                title: "Wishlist",
                tabBarIcon: function renderWishlistTabIconACB() {
                    return <Text>❤️</Text>;
                },
                }}
            />

            <Tabs.Screen 
                name="profile" 
                options={{
                title: "Profile",
                tabBarIcon: function renderProfileTabIconACB() {
                    return <Text>👤</Text>;
                },
                }}
            />
        </Tabs>
    );
});