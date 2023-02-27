import type { Component } from 'solid-js';
import { getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

const auth = getAuth();

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential?.accessToken
            // The signed-in user info.
            const user = result.user;
            console.log(user)

            // write username to webpage
            const username = document.getElementById("username");
            if (typeof user?.displayName === "string") {
                username ? username.innerHTML = `welkom ${user?.displayName}` : null;
            }

        });
}

const LoginGoogle: Component = () => {
    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

export default LoginGoogle;