import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export function AuthView(props) {
    // for reference for the rest!!
    // props.isRegisterMode   - bool, true = register form, false = login form
    // props.email            - current email input value
    // props.password         - current password input value
    // props.errorMessage     - error string to display, or null
    // props.onEmailChange    - called with new email string
    // props.onPasswordChange - called with new password string
    // props.onSubmit         - called when Login/Register button pressed
    // props.onToggleMode     - called when user wants to switch between login/register

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Solo Buddy</Text>
            <Text style={styles.subtitle}>
                {props.isRegisterMode ? "Create an account" : "Sign in to continue"}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={props.email}
                onChangeText={props.onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={props.password}
                onChangeText={props.onPasswordChange}
                secureTextEntry
            />

            {props.errorMessage ? (
                <Text style={styles.error}>{props.errorMessage}</Text>
            ) : null}

            <Button
                title={props.isRegisterMode ? "Register" : "Login"}
                onPress={props.onSubmit}
            />

            <Text style={styles.toggle} onPress={props.onToggleMode}>
                {props.isRegisterMode
                    ? "Already have an account? Sign in"
                    : "No account yet? Register"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#413a3a",
        textAlign: "center",
        marginBottom: 32,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d4cfcf",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    error: {
        color: "#c03232",
        marginBottom: 12,
        textAlign: "center",
    },
    toggle: {
        marginTop: 20,
        textAlign: "center",
        color: "#1f58d2",
        fontSize: 14,
    },
});