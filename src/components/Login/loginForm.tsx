import type { Component } from 'solid-js';
import useForm from "./useForm";

import './loginForm.scss';

const LoginForm: Component = () => {
    const { form, updateFormField, submit } = useForm();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const result: HTMLElement | null = document.getElementById('result');

        const submitResult = await submit(form);
        await submitResult.match(
            (_: Boolean) => result ? result.innerHTML = "Login is gelukt" : null,
            (err: Error) => result ? result.innerHTML = err.message : null
        )
    }

    return (
        <div class="login-form">
            <form onSubmit={handleSubmit} method="post">
                <div class="login-form__input">
                    <label for="email" class="login-form__label">Email</label> <br/>
                    <input
                        type="text"
                        value={form.email}
                        onChange={updateFormField("email")}
                    />
                </div>

                <div class="login-form__input">
                    <label for="password" class="login-form__label">Password</label> <br/>
                    <input
                        type="password"
                        value={form.password}
                        onChange={updateFormField("password")}
                    />
                </div>

                <div class="login-form__submit">
                    <button type="submit">Login</button>
                </div>
            </form>
            <div id="result"></div>
        </div>
    )
}

export default LoginForm;
