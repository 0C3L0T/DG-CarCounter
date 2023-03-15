import {lazy, Show, createSignal} from "solid-js";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";

const AllOrders = lazy(() => import('./AllOrders'));
const Login = lazy(() => import('../Login/Login'));
const Delivery = lazy(() => import('./Delivery'));

const auth = getAuth();

const Overview = () => {
    const [user, setUser] = createSignal<User|null>(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        }
    });

    return (
        <Show when={user()} fallback={
            <div>
                <p>Log in om de overzichten te bekijken</p>
                <Login/>
            </div>
        } keyed>
            <div>
                <AllOrders/>
                <Delivery/>
            </div>
        </Show>
    );
}

export default Overview;