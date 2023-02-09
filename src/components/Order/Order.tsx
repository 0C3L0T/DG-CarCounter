import type { Component } from 'solid-js';
import {createSignal, lazy, Show} from 'solid-js';
import { onAuthStateChanged, getAuth, User} from "firebase/auth";

const OrderForm = lazy(() => import('./OrderForm'));
const Login = lazy(() => import('../Login'));

const auth = getAuth();

const Order: Component = () => {
    const [user, setUser] = createSignal<User|null>(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            console.log(user)
        }
    });

    return (
        <Show
            when={user()}
            fallback={
                <div>
                    <p>Log in om een order te plaatsen</p>
                    <Login/>
                </div>
            }
            keyed
        >
            <OrderForm user={user() as User}></OrderForm>
        </Show>
    )
}

export default Order;