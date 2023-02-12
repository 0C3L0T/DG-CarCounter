import type { Component } from 'solid-js';
import useForm from './useForm';

import { User } from 'firebase/auth';

const OrderForm: Component<{user: User}> = (props) => {
    const { form, updateFormField, submit } = useForm(props.user);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const result: HTMLElement | null = document.getElementById('result');

        if (await submit(form)) {
            result ? result.innerHTML = "Order is aangemaakt" : null;
            console.log("goed")
        } else {
            result ? result.innerHTML = "Er is iets fout gegaan" : null;
            console.log("fout");
        }
    }

    return (
        // look at For
        <div>
            <form onSubmit={handleSubmit} method="post">
                <h1>Maak Order</h1>

                <label for="brand">Merk</label> <br/>
                <input
                    type="text"
                    value={form.brand}
                    onChange={updateFormField("brand")}
                /> <br/>

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
                    <option value="hatchback">Hatchback</option>
                    <option value="sedan">Sedan</option>
                    <option value="coupe">Coupe</option>
                    <option value="suv">SUV</option>
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