import type { Component } from 'solid-js';
import {createSignal, Show, For} from 'solid-js';
import { getFirestore, collection, onSnapshot} from "firebase/firestore";
import type {DocumentReference} from "firebase/firestore";
import { getFunctions, httpsCallable} from "firebase/functions";

import './allOrders.scss';


const db = getFirestore();
const functions = getFunctions();
const removeOrder = httpsCallable(functions, 'removeOrder');


function removeOrderWrapper(orderRef: DocumentReference) {
    // create a popup to confirm the deletion
    if (confirm("Weet je zeker dat je deze order wilt verwijderen?")) {
        removeOrder({orderId: orderRef.id}).then(() => {
            console.log("Order deleted");
        }).catch((error) => {
            console.log(error);
        });
    } else {
        return null;
    }
}

const OrderRow: Component<{orderRef: DocumentReference}> = (props) => {
    const orderRef = props.orderRef;
    return () => {
        const [order, setOrder] = createSignal<any>(null);
        onSnapshot(orderRef, (orderSnapshot) => {
            setOrder(orderSnapshot.data());
        });

        return (
            <tr>
                <td>{order()?.brand}</td>
                <td>{order()?.model}</td>
                <td>{order()?.bodyType}</td>
                <td>{order()?.color}</td>
                <td>{order()?.licensePlate}</td>
                <td>{order()?.plan}</td>
                <td>{order()?.status}</td>
                <td>{order()?.date}</td>
                <td>{order()?.endDate}</td>
                <td>{order()?.duration}</td>
                <td>{order()?.paid ? 'ja' : 'nee'}</td>
                <td>{order()?.isRush ? 'ja' : 'nee'}</td>
                <td>
                    <button
                        class="order-row__delete"
                        onClick={() => {
                            removeOrderWrapper(orderRef);
                        }}>
                        Verwijder
                    </button>
                </td>
            </tr>
        );
    };
}

const AllOrders: Component = () => {
    const [orderRefs, setOrderRefs] = createSignal<DocumentReference[]>([]);
    const orderReference = collection(db, "orders");

    // runs every time a new snapshot is available
    onSnapshot(orderReference, (orderSnapshot) => {
        const orders: DocumentReference[] = [];
        orderSnapshot.forEach((doc) => {
            orders.push(doc.ref);
        });
        setOrderRefs(orders);
    });


    return (
        <div class="table-view">
            <h1>Alle Orders</h1>
            <Show
                when={orderRefs().length != 0}
                fallback={<div class="table-view--empty"><p>Er zijn nog geen orders</p></div>}
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
                            <th>Begin</th>
                            <th>Eind</th>
                            <th>Duur(in tijdslots)</th>
                            <th>Betaald</th>
                            <th>Spoed</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={orderRefs()}>
                            {(orderRef) => (
                                <OrderRow orderRef={orderRef} />
                            )}
                        </For>
                    </tbody>
                </table>
        </Show>
    </div>
    )
}

export default AllOrders;
