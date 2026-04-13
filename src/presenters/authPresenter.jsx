import { useState } from "react";
import { observer } from "mobx-react-lite";
import { AuthView } from "/src/native-views/authView.jsx";
import { signUpWithEmail, signInWithEmail, signOutUser } from "/src/firebaseModel.js";

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

    async function userSubmittedFormACB() {
        setErrorMessage(null);
        try {
            if (isRegisterMode) {
                await signUpWithEmail(email, password);
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
        setIsRegisterMode(!isRegisterMode);
    }

    return (
        <AuthView
            isRegisterMode={isRegisterMode}
            email={email}
            password={password}
            errorMessage={errorMessage}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={userSubmittedFormACB}
            onToggleMode={userToggledModeACB}
        />
    );
});

export default AuthPresenter;
export { signOutUser };