import type { Component } from "solid-js";
import {createSignal, lazy, Show} from "solid-js";
import {onAuthStateChanged, getAuth, User} from "firebase/auth";

const ScheduleDay = lazy(() => import('./ScheduleDay'));
const Login = lazy(() => import('../Login/Login'));

import "./schedule.scss";

const auth = getAuth();

const Schedule: Component = () => {
    const [user, setUser] = createSignal<User|null>(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        }
    });
    const today = new Date();
    const tomorrow = new Date();
    const dayAfterTomorrow = new Date();
    const dayAfterDayAfterTomorrow = new Date();

    tomorrow.setDate(today.getDate() + 1);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    dayAfterDayAfterTomorrow.setDate(today.getDate() + 3);

    return (
        <Show when={user()} fallback={<Login/>} keyed>
             <div class="schedule">
                 <ScheduleDay date={today}/>
                 <ScheduleDay date={tomorrow}/>
                 <ScheduleDay date={dayAfterTomorrow}/>
                 <ScheduleDay date={dayAfterDayAfterTomorrow}/>
             </div>
        </Show>
    );
};

export default Schedule;
