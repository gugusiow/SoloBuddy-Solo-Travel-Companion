import { useState } from "react";
import { observer } from "mobx-react-lite";
import * as ImagePicker from "expo-image-picker";
import { AuthView } from "/src/native-views/authView.jsx";
import { signUpWithEmail, signInWithEmail, signOutUser, saveUserProfile, uploadProfilePhoto } from "/src/firebaseModel.js";

// handles both login, register, logout.
//   props.model - the reactive MobX model
const AuthPresenter = observer(function AuthPresenter(props) {
    const model = props.model;

    // i use useState here instead of mobx cuz these are temporary form values
    // only exist when user is on the auth screen, no need store them.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // extra fields for registration
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUri, setAvatarUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    async function userChosePhotoACB() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setErrorMessage("Permission to access photos was denied.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets?.length) {
            setAvatarUri(result.assets[0].uri);
        }
    }

    async function userSubmittedFormACB() {
        setErrorMessage(null);
        try {
            if (isRegisterMode) {
                const credential = await signUpWithEmail(email, password);
                const uid = credential.user.uid;

                let avatarUrl = "";
                if (avatarUri) {
                    setUploading(true);
                    try {
                        avatarUrl = await uploadProfilePhoto(avatarUri, uid);
                    } finally {
                        setUploading(false);
                    }
                }

                await saveUserProfile(uid, {
                    name: name.trim(),
                    email: email.trim(),
                    birthday: birthday.trim(),
                    phone: phone.trim(),
                    avatarUrl,
                });
            } else {
                await signInWithEmail(email, password);
            }
            // onauthstatechanged in _layout.jsx handles updating model.currentUser
        } catch (error) {
            const code = error.code ?? "";
            if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found" || code === "auth/invalid-email") {
                setErrorMessage("Invalid email or password.");
            } else if (code === "auth/email-already-in-use") {
                setErrorMessage("An account with this email already exists.");
            } else if (code === "auth/weak-password") {
                setErrorMessage("Password must be at least 6 characters.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    }

    function userToggledModeACB() {
        setErrorMessage(null);
        setName("");
        setBirthday("");
        setPhone("");
        setAvatarUri(null);
        setIsRegisterMode(!isRegisterMode);
    }

    return (
        <AuthView
            isRegisterMode={isRegisterMode}
            email={email}
            password={password}
            name={name}
            birthday={birthday}
            phone={phone}
            avatarUri={avatarUri}
            uploading={uploading}
            errorMessage={errorMessage}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onNameChange={setName}
            onBirthdayChange={setBirthday}
            onPhoneChange={setPhone}
            onChoosePhoto={userChosePhotoACB}
            onSubmit={userSubmittedFormACB}
            onToggleMode={userToggledModeACB}
        />
    );
});

export default AuthPresenter;
export { signOutUser };