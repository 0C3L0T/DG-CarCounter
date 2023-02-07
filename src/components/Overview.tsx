import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;

const db = getFirestore();

// TODO impolement document created callback
// display all current orders in the database
const Overview: Component = () => {
    const [orders, setOrders] = createSignal<DocumentData[]>([]);

    const getOrders = async () => {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orders_snapshot: DocumentData[] = querySnapshot.docs.map(doc => doc.data());
        setOrders(orders_snapshot);
    }

    onMount(getOrders);

    return (
        <div>
            <h1>Overzicht</h1>
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
    )
}

export default Overview;