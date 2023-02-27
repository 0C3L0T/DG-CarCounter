import type { Component } from 'solid-js';
import useForm from "./useForm";

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
        <div>
            <form onSubmit={handleSubmit} method="post">
                <label for="email">Email</label> <br/>
                <input
                    type="text"
                    value={form.email}
                    onChange={updateFormField("email")}
                /> <br/>

                <label for="password">Password</label> <br/>
                <input
                    type="password"
                    value={form.password}
                    onChange={updateFormField("password")}
                /> <br/>

                <button type="submit">Login</button>
            </form>
            <div id="result"></div>
        </div>
    )
}

export default LoginForm;