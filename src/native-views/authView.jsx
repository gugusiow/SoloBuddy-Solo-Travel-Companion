import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme } from "react-native";

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

    const dark = useColorScheme() === "dark";
    const t = dark ? darkTokens : lightTokens;

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <Text style={[styles.title, { color: t.title }]}>Solo Buddy</Text>
            <Text style={[styles.subtitle, { color: t.subtitle }]}>
                {props.isRegisterMode ? "Create an account" : "Sign in to continue"}
            </Text>

            <TextInput
                style={[styles.input, { borderColor: t.inputBorder, backgroundColor: t.inputBg, color: t.text }]}
                placeholder="Email"
                placeholderTextColor={t.placeholder}
                value={props.email}
                onChangeText={props.onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={[styles.input, { borderColor: t.inputBorder, backgroundColor: t.inputBg, color: t.text }]}
                placeholder="Password"
                placeholderTextColor={t.placeholder}
                value={props.password}
                onChangeText={props.onPasswordChange}
                secureTextEntry
            />

            {props.errorMessage ? (
                <Text style={styles.error}>{props.errorMessage}</Text>
            ) : null}

            <Pressable
                style={({ pressed }) => [styles.button, { backgroundColor: t.buttonBg, opacity: pressed ? 0.85 : 1 }]}
                onPress={props.onSubmit}
            >
                <Text style={[styles.buttonText, { color: t.buttonText }]}>
                    {props.isRegisterMode ? "Register" : "Login"}
                </Text>
            </Pressable>

            <Text style={[styles.toggle, { color: t.link }]} onPress={props.onToggleMode}>
                {props.isRegisterMode
                    ? "Already have an account? Sign in"
                    : "No account yet? Register"}
            </Text>
        </View>
    );
}

const lightTokens = {
    bg: "#ffffff",
    title: "#111827",
    subtitle: "#6b7280",
    text: "#111827",
    placeholder: "#9ca3af",
    inputBg: "#f9fafb",
    inputBorder: "#d1d5db",
    buttonBg: "#111827",
    buttonText: "#ffffff",
    link: "#1f58d2",
};

const darkTokens = {
    bg: "#0f172a",
    title: "#f1f5f9",
    subtitle: "#94a3b8",
    text: "#f1f5f9",
    placeholder: "#64748b",
    inputBg: "#1e293b",
    inputBorder: "#334155",
    buttonBg: "#f1f5f9",
    buttonText: "#0f172a",
    link: "#60a5fa",
};

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
        textAlign: "center",
        marginBottom: 32,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    error: {
        color: "#ef4444",
        marginBottom: 12,
        textAlign: "center",
    },
    button: {
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "700",
    },
    toggle: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 14,
    },
});
