import type {Component} from 'solid-js';
import {createResource, createSignal, Show} from 'solid-js';
import type {DocumentData} from "firebase/firestore";
import {doc, getDoc, getFirestore, onSnapshot} from "firebase/firestore";

const db = getFirestore()


const Schedule: Component<{date: Date}> = (props) => {
    const scheduleRef = doc(db, "schedule", props.date.toDateString());

    const [orderIds, setOrderIds] = createSignal<string[]>([]);
    onSnapshot(scheduleRef,  (scheduleSnapshot) => {
        const data = scheduleSnapshot.data();
        const _orderIds: string[] = [];
        data?.slots?.map((slot: DocumentData) => {
            if (slot.toString() != "") {
                _orderIds.push(slot.toString());
            }
        });
        setOrderIds(_orderIds);
    });

    const [orders] = createResource(orderIds,async (orderIds) => {
        const orders = orderIds.map(
            async (orderId) => {
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
            <h1>Orders voor {props.date.toLocaleDateString("nl-NL")}</h1>
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
                    </tr>
                    </thead>
                    <tbody>
                    {orders()!.map((order, __created_at) => (
                        <tr>
                            <td>{order!.brand}</td>
                            <td>{order!.model}</td>
                            <td>{order!.bodyType}</td>
                            <td>{order!.color}</td>
                            <td>{order!.licensePlate}</td>
                            <td>{order!.plan}</td>
                            <td>{order!.status}</td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </Show>
        </div>
    );
}

export default Schedule;