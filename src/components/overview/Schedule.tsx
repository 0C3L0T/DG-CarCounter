import type { Component } from 'solid-js';
import {createSignal, For, Show} from 'solid-js';
import { getFirestore, getDoc, doc, onSnapshot} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

const db = getFirestore()

const today = new Date();
today.setDate(today.getDate() + 1)

const scheduleRef = doc(db, "schedule", today.toDateString());
const [orders, setOrders] = createSignal<DocumentData[]>([])
onSnapshot(scheduleRef, (querySnapshot) => {
    const _orders: DocumentData[] = [];
    // get the slots array from the document
    const data = querySnapshot.data();
    if (data) {
        data.slots.forEach((orderId: DocumentData) => {
            //filter out the empty slots
            if (orderId.order_id != "") {
                // get the corresponding order from the slot
                const orderDoc = doc(db, "orders", orderId.order_id);
                getDoc(orderDoc).then((doc) => {
                    if (doc.exists()) {
                        _orders.push(doc.data());
                    }
                });
            }
        });
    }
    setOrders(_orders);
    console.log(orders()) // works here
});

const Schedule: Component<{date: Date}> = (props) => {
    // get the schedule for the given date
    return (
        <div>
            <h1>Schema voor {props.date.toLocaleDateString("nl-NL")}</h1>
            <Show when={(orders().length != 0)} keyed={true} fallback={<div>Er zijn nog geen orders</div>}>
                <table>
                    <thead>
                        <tr>
                            <th>Merk</th>
                            <th>Type</th>
                            <th>Carroserie</th>
                            <th>Kleur</th>
                            <th>Kenteken</th>
                            <th>Behandeling</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={orders()}>
                            {(order) => (
                                <tr>
                                    <td>{order.brand}</td>
                                    <td>{order.model}</td>
                                    <td>{order.bodyType}</td>
                                    <td>{order.color}</td>
                                    <td>{order.licensePlate}</td>
                                    <td>{order.plan}</td>
                                    <td>{order.status}</td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </Show>
        </div>
    );
}

export default Schedule;