import type { Component } from 'solid-js';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore/lite";
import { User } from "firebase/auth";

const db = getFirestore();

const OrderForm: Component<{user: User}> = (props) => {
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
        const created_at = serverTimestamp();

        console.log(brand, type, body, color, license_plate, plan, created_at)
        const result: HTMLElement | null = document.getElementById('result');

        try {
            // add order to user collection in database
            const docRef = await addDoc(collection(db, "users", props.user.uid, "orders"), {
                brand,
                type,
                body,
                color,
                license_plate,
                plan,
                created_at
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
                <select name="carroserie">
                    <option value="hatchback">Hatchback</option>
                    <option value="sedan">Sedan</option>
                    <option value="coupe">Coupe</option>
                    <option value="suv">SUV</option>
                </select><br />

                <label>Kleur</label> <br />
                <select name="kleur">
                    <option value="black">Zwart</option>
                    <option value="other">Anders</option>
                </select><br />

                <label>Kenteken</label> <br />
                <input type="text" name="kenteken" /> <br />

                <label>Behandeling</label> <br />
                <select name="behandeling">
                    <option value="bronze">Brons</option>
                    <option value="silver">Zilver</option>
                    <option value="gold">Goud</option>
                </select><br />

                <input type={"submit"} value={"Maak Order"} />
            </form>
            <p id={"result"}></p>
        </div>
    );
};

export default OrderForm;