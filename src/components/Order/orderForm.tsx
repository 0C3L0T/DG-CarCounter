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
        <div class="order-form">
            <form onSubmit={handleSubmit} method="post">
                <div class="order-form__header"><h1>Maak Order</h1></div>
                <div class="order-form__input">
                    <label for="brand" class="order-form__label">Merk</label>
                    <div class="order-form__select-box">
                        <select
                            value={form.brand}
                            onChange={updateFormField("brand")}
                        >
                            <For each={Object.values(orderBrand)}>
                                {(brand) => <option value={brand}>{brand}</option>}
                            </For>
                        </select>
                    </div>
                </div>
                <div class="order-form__input">
                    <label for="model" class="order-form__label">Model</label>
                    <input
                        type="text"
                        value={form.model}
                        onChange={updateFormField("model")}
                    />
                </div>
                <div class="order-form__input">
                    <label for="bodyType" class="order-form__label">Carroserie</label>
                    <div class="order-form__select-box">
                        <select
                            value={form.bodyType}
                            onChange={updateFormField("bodyType")}
                        >
                            <For each={Object.values(orderBodyType)}>
                                {(bodyType) => <option value={bodyType}>{bodyType}</option>}
                            </For>
                        </select>
                    </div>
                </div>
                <div class="order-form__input">
                    <label for="color" class="order-form__label">Kleur</label>
                    <div class="order-form__select-box">
                        <select
                            value={form.color}
                            onChange={updateFormField("color")}
                        >
                            <option value="black">Zwart</option>
                            <option value="other">Anders</option>
                        </select>
                    </div>
                </div>
                <div class="order-form__input order-form__input--number-plate">
                    <label for="licensePlate" class="order-form__label">Kenteken</label>
                    <div class="order-form__number-plate">
                        <div class="order-form__number-plate--NL"><p>NL</p></div>
                        <input
                            type="text"
                            value={form.licensePlate}
                            onChange={updateFormField("licensePlate")}
                        />
                    </div>
                </div>
                <div class="order-form__input">
                    <label for="plan" class="order-form__label">Behandeling</label>
                    <div class="order-form__select-box">
                        <select
                            value={form.plan}
                            onChange={updateFormField("plan")}
                        >
                            <For each={Object.values(orderPlan)}>
                                {(plan) => <option value={plan}>{plan}</option>}
                            </For>
                        </select>
                    </div>
                </div>
                <div class="order-form__input">
                    <label for="date" class="order-form__label">Datum</label>
                    <input
                        type={"date"}
                        value={form.date} // TODO: fix locale date, should be dd-mm-yyyy
                        onChange={updateFormField("date")}
                    />
                </div>
                <div class="order-form__input">
                    <label for="status" class="order-form__label">Spoedorder</label>
                    <input
                        type="checkbox"
                        onChange={updateFormField("isRush")}
                    />
                </div>
                <div class="order-form__submit">
                    <input type={"submit"} value={"Maak Order"}/>
                </div>
            </form>

            <p id={"result"}></p>
        </div>
    );
}

export default OrderForm;