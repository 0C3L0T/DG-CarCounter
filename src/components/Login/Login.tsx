import type { Component } from 'solid-js';

import LoginForm from "./loginForm";
import LoginGoogle from "./loginGoogle";

const Login: Component = () => {
    return (
        <div>
            <h1>Login</h1>
            <LoginForm></LoginForm>
            <p>or</p>
            <LoginGoogle></LoginGoogle>
        </div>
    );
};

export default Login;