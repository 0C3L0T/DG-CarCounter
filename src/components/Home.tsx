import type { Component } from "solid-js";
import {A} from "@solidjs/router";

const Home: Component = () => {
    return (
        <div>
        <h1>Home</h1>
            <A href={"/login"}>Login</A><br/>
            <A href={"/order"}>Order</A><br/>
            <A href={"/overview"}>Overview</A>
        </div>
    );
};

export default Home;