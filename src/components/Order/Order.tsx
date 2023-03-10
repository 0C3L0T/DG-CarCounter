import type { Component } from 'solid-js';
import {createSignal, lazy, Show} from 'solid-js';
import { onAuthStateChanged, getAuth, User} from "firebase/auth";

const OrderForm = lazy(() => import('./orderForm'));
const Login = lazy(() => import('../Login/Login'));

const auth = getAuth();

import './order.scss';

const Order: Component = () => {
    const [user, setUser] = createSignal<User|null>(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        }
    });

    return (
        <Show
            when={user()} fallback={
                <div>
                    <p>Log in om een order te plaatsen</p>
                    <Login/>
                </div>
            }
            keyed>
            <OrderForm/>
        </Show>
    );
}

export default Order;
