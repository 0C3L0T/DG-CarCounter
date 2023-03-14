import type { Component } from 'solid-js';

import LoginForm from "./loginForm";
import LoginGoogle from "./loginGoogle";

import './login.scss';

const Login: Component = () => {
    return (
        <div class="login">
            <h1>Login</h1>
            <div class="login__buttons">
                <LoginForm></LoginForm>
                <p>or</p>
                <LoginGoogle></LoginGoogle>
            </div>
        </div>
    );
};

export default Login;
