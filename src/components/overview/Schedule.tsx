import type {Component} from 'solid-js';
import {createResource, createSignal, Show} from 'solid-js';
import type {DocumentData} from "firebase/firestore";
import {doc, getDoc, getFirestore, onSnapshot} from "firebase/firestore";
import {For} from "solid-js/web";

const db = getFirestore()


const Schedule: Component<{date: Date}> = (props) => {
    const scheduleRef = doc(db, "schedule", props.date.toISOString().slice(0, 10));

    const [orderIds, setOrderIds] = createSignal<string[]>([]);
    onSnapshot(scheduleRef,  (scheduleSnapshot) => {
        const data = scheduleSnapshot.data();
        const _orderIds: string[] = [];
        data?.slots?.map((slot: DocumentData) => {
            _orderIds.push(slot.toString());
        });
        setOrderIds(_orderIds);
    });

    const [orders] = createResource(orderIds,async (orderIds) => {
        const orders = orderIds.map(
            async (orderId) => {
                if (orderId == "") {
                    return null;
                }
                const order = await getDoc(doc(db, "orders", orderId));
                if (order.exists()) {
                    return order.data();
                }
            }
        )
        return Promise.all(orders);
    });

    return (
        <div>
            <h1>Werkorders voor {props.date.toLocaleDateString("nl-NL")}</h1>
            <Show
                when={(!orders.loading && orders()!.length != 0)}
                fallback={<div>Er zijn nog geen orders</div>}
                keyed>
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
                        <th>Betaald</th>
                    </tr>
                    </thead>
                    <tbody>
                    <For each={orders()}>
                        {(order) => (
                            <Show when={order != null} fallback={<tr><td>Open slot</td></tr>} keyed>
                                <tr>
                                    <td>{order!.brand}</td>
                                    <td>{order!.model}</td>
                                    <td>{order!.bodyType}</td>
                                    <td>{order!.color}</td>
                                    <td>{order!.licensePlate}</td>
                                    <td>{order!.plan}</td>
                                    <td>{order!.status}</td>
                                    <td>{order!.hasPaid ? 'ja' : 'nee'}</td>
                                </tr>
                            </Show>
                        )}
                    </For>
                    </tbody>
                </table>
            </Show>
        </div>
    );
}

export default Schedule;