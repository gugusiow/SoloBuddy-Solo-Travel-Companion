import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme, ScrollView, Image, ActivityIndicator } from "react-native";

export function AuthView(props) {
    // for reference for the rest!!
    // props.isRegisterMode   - bool, true = register form, false = login form
    // props.email            - current email input value
    // props.password         - current password input value
    // props.name             - full name (register only)
    // props.birthday         - birthday string (register only)
    // props.phone            - phone string (register only)
    // props.avatarUri        - local image URI selected by user (register only)
    // props.uploading        - bool, true while uploading photo
    // props.errorMessage     - error string to display, or null
    // props.onEmailChange    - called with new email string
    // props.onPasswordChange - called with new password string
    // props.onNameChange     - called with new name string (register only)
    // props.onBirthdayChange - called with new birthday string (register only)
    // props.onPhoneChange    - called with new phone string (register only)
    // props.onChoosePhoto    - called when user taps avatar / choose photo (register only)
    // props.onSubmit         - called when Login/Register button pressed
    // props.onToggleMode     - called when user wants to switch between login/register

    const dark = useColorScheme() === "dark";
    const t = dark ? darkTokens : lightTokens;

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: t.bg }]}
            keyboardShouldPersistTaps="handled"
        >
            <Image
                source={require("../assets/login-logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={[styles.subtitle, { color: t.subtitle }]}>
                {props.isRegisterMode ? "Create an account" : "Sign in to continue"}
            </Text>

            {/* avatar picker for register only */}
            {props.isRegisterMode ? (
                <View style={styles.avatarSection}>
                    {props.avatarUri ? (
                        <Image source={{ uri: props.avatarUri }} style={styles.avatarImage} />
                    ) : (
                        <View style={[styles.avatarFallback, { backgroundColor: t.avatarBg }]}>
                            <Text style={styles.avatarFallbackText}>?</Text>
                        </View>
                    )}
                    <Pressable
                        style={[styles.photoButton, { backgroundColor: t.photoBg }]}
                        onPress={props.onChoosePhoto}
                        disabled={props.uploading}
                    >
                        <Text style={[styles.photoButtonText, { color: t.text }]}>
                            {props.uploading ? "Uploading..." : "Choose photo"}
                        </Text>
                    </Pressable>
                    {props.uploading ? <ActivityIndicator style={styles.spinner} /> : null}
                </View>
            ) : null}

            {/* name for register only */}
            {props.isRegisterMode ? (
                <TextInput
                    style={[styles.input, { borderColor: t.inputBorder, backgroundColor: t.inputBg, color: t.text }]}
                    placeholder="Full name"
                    placeholderTextColor={t.placeholder}
                    value={props.name}
                    onChangeText={props.onNameChange}
                    autoCapitalize="words"
                />
            ) : null}

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

            {/* birthday + phone for register only */}
            {props.isRegisterMode ? (
                <>
                    <TextInput
                        style={[styles.input, { borderColor: t.inputBorder, backgroundColor: t.inputBg, color: t.text }]}
                        placeholder="Birthday (YYYY-MM-DD)"
                        placeholderTextColor={t.placeholder}
                        value={props.birthday}
                        onChangeText={props.onBirthdayChange}
                    />
                    <TextInput
                        style={[styles.input, { borderColor: t.inputBorder, backgroundColor: t.inputBg, color: t.text }]}
                        placeholder="Phone (optional)"
                        placeholderTextColor={t.placeholder}
                        value={props.phone}
                        onChangeText={props.onPhoneChange}
                        keyboardType="phone-pad"
                    />
                </>
            ) : null}

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
        </ScrollView>
    );
}

const lightTokens = {
    bg: "#F5E8D3",
    title: "#111827",
    subtitle: "#6b7280",
    text: "#111827",
    placeholder: "#9ca3af",
    inputBg: "#f9fafb",
    inputBorder: "#d1d5db",
    buttonBg: "#111827",
    buttonText: "#ffffff",
    link: "#1f58d2",
    avatarBg: "#7d5a50",
    photoBg: "#e5e7eb",
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
    avatarBg: "#4f46e5",
    photoBg: "#334155",
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    avatarSection: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    avatarFallback: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatarFallbackText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "700",
    },
    photoButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    photoButtonText: {
        fontWeight: "600",
        fontSize: 14,
    },
    spinner: {
        marginTop: 8,
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
      logo: {
      width: 140,
      height: 140,
      alignSelf: "center",
      marginBottom: 1,
    },
});
