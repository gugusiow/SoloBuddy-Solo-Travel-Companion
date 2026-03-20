import { Tabs } from "expo-router"
import { Text } from "react-native"

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: function renderHomeTabIconACB() { return <Text>🗺</Text> },
                }}
            />
        </Tabs>
    )
}
