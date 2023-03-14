import type { Component } from "solid-js";
import {A} from "@solidjs/router";

import "./home.scss";

const Home: Component = () => {
    return (
        <div class="home">
            <h1>Home</h1>
            <div class="home__buttons">
                <A href={"/login"} class="home__button"><p>Login</p></A><br/>
                <A href={"/order"} class="home__button"><p>Order</p></A><br/>
                <A href={"/overview"} class="home__button"><p>Overview</p></A>
            </div>
        </div>
    );
};

export default Home;
