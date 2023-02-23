import type { Component } from 'solid-js';
import {createSignal, Show} from 'solid-js';
import { getFirestore, collection, onSnapshot} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

const db = getFirestore();


const AllOrders: Component = () => {
    const [orders, setOrders] = createSignal<DocumentData[]>([]);
    const orderReference = collection(db, "orders");

    onSnapshot(orderReference, (orderSnapshot) => {
        const orders: DocumentData[] = [];
        orderSnapshot.forEach((doc) => {
            orders.push(doc.data());
        });
        setOrders(orders);
    });


    return (
        <div>
            <h1>Alle Orders</h1>
            <Show
                when={orders().length != 0}
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
                        {orders().map((order, __created_at) => (
                            <tr>
                                <td>{order.brand}</td>
                                <td>{order.model}</td>
                                <td>{order.bodyType}</td>
                                <td>{order.color}</td>
                                <td>{order.licensePlate}</td>
                                <td>{order.plan}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </Show>
    </div>
    )
}

export default AllOrders;