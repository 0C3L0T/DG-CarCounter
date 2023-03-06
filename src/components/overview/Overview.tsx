import {lazy, Show, createSignal} from "solid-js";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";

const AllOrders = lazy(() => import('./AllOrders'));
const Schedule = lazy(() => import('./Schedule'));
const Login = lazy(() => import('../Login/Login'));
const Delivery = lazy(() => import('./Delivery'));

const auth = getAuth();

const Overview = () => {
    const [user, setUser] = createSignal<User|null>(null);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

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
                <Schedule date={today}/>
                <Schedule date={tomorrow}/>
                <Delivery/>
            </div>
        </Show>
    );
}

export default Overview;