import type { Component } from 'solid-js';

const Order: Component = () => {

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const kenteken = data.get('kenteken');
        const naam = data.get('naam');
        const telefoonnummer = data.get('telefoonnummer');
        const behandeling = data.get('behandeling');

        console.log(kenteken, naam, telefoonnummer, behandeling);
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
        </div>
    );
};

export default Order;