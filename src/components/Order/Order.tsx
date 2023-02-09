import type { Component } from 'solid-js';
import {createSignal, lazy} from 'solid-js';
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


    const userValue = user();

    return (
        <div>
            {
                userValue ?
                    <OrderForm user={userValue}/>
                    : <><Login/><p>Log in om een order te plaatsen</p></>
            }
        </div>
    );
}

export default Order;