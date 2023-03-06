import type { Component } from 'solid-js';
import useForm from './useForm';
import { For } from 'solid-js/web';

import {orderBodyType, orderBrand, orderPlan} from "./orderTypes";

const OrderForm: Component = () => {
    const { form, updateFormField, submit, clearForm } = useForm();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const result: HTMLElement | null = document.getElementById('result');

        const submitResult = await submit(form);
        await submitResult.match(
            (_: Boolean) => {
                result ? result.innerHTML = "Order is aangemaakt" : null;
                clearForm();
            },
            (err: Error) => {result ? result.innerHTML = err.message : null}
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
                    <For each={Object.values(orderPlan)}>
                        {(plan) => <option value={plan}>{plan}</option>}
                    </For>
                </select><br/>

                <label for="date">Datum</label> <br/>
                <input
                    type={"date"}
                    value={form.date} //TODO: fix locale date, should be dd-mm-yyyy
                    onChange={updateFormField("date")}
                /> <br/>

                <label for="status">Spoedorder</label> <br/>
                <input
                    type="checkbox"
                    onChange={updateFormField("isRush")}
                /> <br/>

                <input type={"submit"} value={"Maak Order"}/>
            </form>

            <p id={"result"}></p>
        </div>
    );
}

export default OrderForm;