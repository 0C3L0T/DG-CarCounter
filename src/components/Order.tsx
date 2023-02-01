import type { Component } from 'solid-js';
import { getFirestore, collection, addDoc } from "firebase/firestore/lite";

const db = getFirestore();

const Order: Component = () => {

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const kenteken = data.get('kenteken');
        const naam = data.get('naam');
        const telefoonnummer = data.get('telefoonnummer');
        const behandeling = data.get('behandeling');

        console.log(kenteken, naam, telefoonnummer, behandeling);
        const result: HTMLElement | null = document.getElementById('result');

        try {
            const docRef = await addDoc(collection(db, "orders"), {
                // make sure created_at is a timestamp given on the server
                liscense_plate: kenteken,
                name: naam,
                phone: telefoonnummer,
                plan: behandeling
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
                <label>Kenteken</label><br />
                <input type="text" name="kenteken" /><br />
                <label>Naam</label><br />
                <input type="text" name="naam" /><br />
                <label>Telefoonnummer</label><br />
                <input type="text" name="telefoonnummer" /><br />
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