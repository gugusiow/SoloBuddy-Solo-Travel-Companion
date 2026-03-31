import { ScrollView, View, Text, Button } from "react-native";
import { observer } from "mobx-react-lite";
import { model } from "../model.js";
import { signOutUser } from "/src/firebaseModel.js";

export default observer(function ProfilePage() {
    async function userPressedLogoutACB() {
        await signOutUser();
    }

    return (
        <ScrollView>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>User Profile</Text>
                <Text style={{ marginTop: 8, color: "#555" }}>{model.currentUser?.email}</Text>
                <View style={{ marginTop: 32 }}>
                    <Button title="Logout" color="#b91c1c" onPress={userPressedLogoutACB} />
                </View>
            </View>
        </ScrollView>
    );
});