import type { Component } from 'solid-js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken
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

const Login: Component = () => {
    return (
        <div>
            <header>
                <h1>Hello Firebase</h1>
            </header>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <h2 id={"username"}></h2>
        </div>
    );
};

export default Login;