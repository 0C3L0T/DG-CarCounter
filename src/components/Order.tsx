import type { Component } from 'solid-js';
import { getFirestore, collection, addDoc } from "firebase/firestore/lite";

const db = getFirestore();

const Order: Component = () => {
    // FORM VALIDATION
    /*
    const [brand, setBrand] = createSignal<string>('');
    const [type, setType] = createSignal<string>('');

    */

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const brand = data.get('merk');
        const type = data.get('type');
        const body = data.get('carroserie');
        const color = data.get('kleur');
        const license_plate = data.get('kenteken');
        const plan = data.get('behandeling');

        console.log(brand, type, body, color, license_plate, plan)
        const result: HTMLElement | null = document.getElementById('result');

        try {
            const docRef = await addDoc(collection(db, "orders"), {
                // created_at will be added automatically
                brand,
                type,
                body,
                color,
                license_plate,
                plan
            });
            console.log("Document written with ID: ", docRef.id);
            result ? result.innerHTML = "Order is aangemaakt" : null;
        } catch (e) {
            console.error("Error adding document: ", e);
            result ? result.innerHTML = "Er is iets fout gegaan" : null;
        }
    }

    return (
        <div>
            <form onsubmit={handleSubmit} method="post">
                <h1>Maak Order</h1>
                <label>Merk</label> <br />
                <input type="text" name="merk" /> <br />
                <label>Type</label> <br />
                <input type="text" name="type" /> <br />
                <label>Carroserie</label> <br />
                <input type="text" name="carroserie" /> <br />
                <label>Kleur</label> <br />
                <select name="kleur">
                    <option value="black">Zwart</option>
                    <option value="other">Anders</option>
                </select><br />
                <label>Kenteken</label> <br />
                <input type="text" name="kenteken" /> <br />
                <label>Behandeling</label> <br />
                <select name="behandeling">
                    <option value="Brons">Brons</option>
                    <option value="Silver">Silver</option>
                    <option value="Goud">Goud</option>
                </select><br />
                <input type={"submit"} value={"Maak Order"} />
            </form>
            <p id={"result"}></p>
        </div>
    );
};

export default Order;