import type { Component } from 'solid-js';
import {createSignal, onMount, Show} from 'solid-js';
import { getFirestore, collection, getDocs, query, onSnapshot} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

const db = getFirestore();

const AllCars: Component = () => {
    const [orders, setOrders] = createSignal<DocumentData[]>([]);

    const orderQuery = query(collection(db, "orders"));
    onSnapshot(orderQuery, (querySnapshot) => {
        const orders: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
            orders.push(doc.data());
        });
        setOrders(orders);
    });

    // get orders from all users
    const getOrders = async () => {
        const orders: DocumentData[] = [];

        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((doc) => {
            orders.push(doc.data());
        });

        setOrders(orders);
    }

    onMount(getOrders);

    return (
        <Show
            when={orders()}
            fallback={<div>Er zijn nog geen orders</div>}
         keyed>
        <div>
            <h1>Alle Orders</h1>
            <table>
                <thead>
                    <tr>
                        <th>Merk</th>
                        <th>Type</th>
                        <th>Carroserie</th>
                        <th>Kleur</th>
                        <th>Kenteken</th>
                        <th>Behandeling</th>
                    </tr>
                </thead>
                <tbody>
                    {orders().map((order, __created_at) => (
                        <tr>
                            <td>{order.brand}</td>
                            <td>{order.type}</td>
                            <td>{order.body}</td>
                            <td>{order.color}</td>
                            <td>{order.license_plate}</td>
                            <td>{order.plan}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </Show>
    )
}

export default AllCars;