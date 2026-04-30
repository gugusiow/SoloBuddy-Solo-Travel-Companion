import { Tabs } from "expo-router"
import { Text } from "react-native"
import { model } from "../model.js"
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { connectToAuth } from "/src/firebaseModel.js";
import AuthPresenter from "../presenters/authPresenter.jsx";

export default observer(function RootLayout() {
    // aft app mounts, set up the firebase auth state observer 
    // connectotauth calls firebase lsitner onauthstatechaged, update model.currentUser and model.ready
    useEffect(function setupAuthListenerACB() {
        const unsubscribe = connectToAuth(model);
        return unsubscribe;
    }, []);

    // firebase resolve the initial auth state 
    if (!model.ready) {
        return <Text>Loading...</Text>;
    }

    // show auth screen if not logged in
    if (!model.currentUser) {
        return <AuthPresenter model={model} />;
    }

    const currentUserName = model.profile?.name || "there";

    // logged in
    return (
        <Tabs>
            <Tabs.Screen 
                name="index" 
                options={{
                    title: "Explore",
                    tabBarLabel: "Explore",
                    headerStyle: {
                        backgroundColor: "#1ba65a", 
                    },
                    headerTintColor: "#fff", // text color
                    headerTitle: model.currentCity ? `Hey ${currentUserName}, let's explore ${model.currentCity}!` : `Hey ${currentUserName}, let's explore!`,
                    tabBarIcon: function renderExploreTabIconACB() {
                        return <Text>🗺️</Text>;
                    },
                }}
            />
            <Tabs.Screen
                name="safety"
                options={{
                    title: "Safety",
                    headerStyle: {
                        backgroundColor: "#1b35a6", 
                    },
                    headerTintColor: "#fff", // text color
                    tabBarIcon: function renderSafetyTabIconACB() {
                        return <Text>🛡️</Text>;
                    },
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    headerStyle: {
                        backgroundColor: "#d85eba", 
                    },
                    headerTintColor: "#fff", // text color
                    tabBarIcon: function renderCommunityTabIconACB() {
                        return <Text>💬</Text>;
                    },
                }}
            />
            <Tabs.Screen
                name="wishlist"
                options={{
                    title: "Wishlist",
                    headerStyle: {
                        backgroundColor: "#a61b2e", 
                    },
                    headerTintColor: "#fff", // text color
                    tabBarIcon: function renderWishlistTabIconACB() {
                        return <Text>❤️</Text>;
                    },
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerStyle: {
                        backgroundColor: "#1ba66e", 
                    },
                    headerTintColor: "#fff", // text color
                    tabBarIcon: function renderProfileTabIconACB() {
                        return <Text>👤</Text>;
                    },
                }}
            />
        </Tabs>
    );
});