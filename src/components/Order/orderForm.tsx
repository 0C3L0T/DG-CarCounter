import type { Component } from 'solid-js';
import useForm from './useForm';
import { User } from 'firebase/auth';
import { For } from 'solid-js/web';

import {orderBodyType, orderBrand} from "./orderTypes";

const OrderForm: Component<{user: User}> = (props) => {
    const { form, updateFormField, submit } = useForm(props.user);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const result: HTMLElement | null = document.getElementById('result');

        const submitResult = await submit(form);
        await submitResult.match(
            (_: Boolean) => result ? result.innerHTML = "Order is aangemaakt" : null,
            (err: Error) => result ? result.innerHTML = err.message : null
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} method="post">
                <h1>Maak Order</h1>

                <label for="brand">Merk</label> <br/>
                <select
                    value={form.brand}
                    onChange={updateFormField("brand")}
                >
                    <For each={Object.values(orderBrand)}>
                        {(brand) => <option value={brand}>{brand}</option>}
                    </For>
                </select><br/>
                <label for="model">Model</label> <br/>
                <input
                    type="text"
                    value={form.model}
                    onChange={updateFormField("model")}
                /> <br/>

                <label for="bodyType">Carroserie</label> <br/>
                <select
                    value={form.bodyType}
                    onChange={updateFormField("bodyType")}
                >
                    <For each={Object.values(orderBodyType)}>
                        {(bodyType) => <option value={bodyType}>{bodyType}</option>}
                    </For>
                </select><br/>

                <label for="color">Kleur</label> <br/>
                <select
                    value={form.color}
                    onChange={updateFormField("color")}
                >
                    <option value="black">Zwart</option>
                    <option value="other">Anders</option>
                </select><br/>

                <label for="licensePlate">Kenteken</label> <br/>
                <input
                    type="text"
                    value={form.licensePlate}
                    onChange={updateFormField("licensePlate")}
                /> <br/>

                <label for="plan">Behandeling</label> <br/>
                <select
                    value={form.plan}
                    onChange={updateFormField("plan")}
                >
                    <option value="bronze">Brons</option>
                    <option value="silver">Zilver</option>
                    <option value="gold">Goud</option>
                </select><br/>

                <label for="status">Spoedorder</label> <br/>
                <input
                    type="checkbox"
                    value={form.status}
                    onChange={updateFormField("status")}
                /> <br/>

                <input type={"submit"} value={"Maak Order"}/>
            </form>

            <p id={"result"}></p>
        </div>
    );
}

export default OrderForm;