import type { Component } from 'solid-js';
import {createSignal, lazy, Show} from 'solid-js';
import { onAuthStateChanged, getAuth, User} from "firebase/auth";

const OrderForm = lazy(() => import('./orderForm'));
const Login = lazy(() => import('../Login/Login'));

const auth = getAuth();

const Order: Component = () => {
    const [user, setUser] = createSignal<User|null>(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        }
    });

    return (
        <Show when={user()} fallback={<Login/>} keyed>
            <OrderForm/>
        </Show>
    );
}

export default Order;
