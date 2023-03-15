import type { Component } from "solid-js";
import {A} from "@solidjs/router";

import "./home.scss";

const Home: Component = () => {
    return (
        <div class="home">
            <h1>Home</h1>
            <div class="home__buttons">
                <A href={"/order"} class="home__button"><p>Order</p></A>
                <A href={"/overview"} class="home__button"><p>Overview</p></A>
                <A href={"/schedule"} class="home__button"><p>Schedule</p></A>
            </div>
        </div>
    );
};

export default Home;
