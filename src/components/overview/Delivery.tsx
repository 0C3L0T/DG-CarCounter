/***
 * @fileoverview Delivery component
 * displays a list of cars that will be delivered on a given day
 *
 * looks at all orders and shows their end date based on their latest occurrence in the schedule
 */

import { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

import "./delivery.scss";

const db = getFirestore();

const Delivery: Component = () => {
  const [orders, setOrders] = createSignal<DocumentData[]>([]);
  const orderReference = collection(db, "orders");

  const today = new Date().toISOString().slice(0, 10);

  // runs every time a new snapshot is available
  onSnapshot(orderReference, (orderSnapshot) => {
    const orders: DocumentData[] = [];
    orderSnapshot.forEach((doc) => {
      const order = doc.data();
      if (order.endDate == today) {
        orders.push(order);
      }
    });
    setOrders(orders);
  });


  return (
    <div class="table-view">
      <h1>Afleveringen vandaag</h1>
      <Show
        when={orders().length != 0}
        fallback={<div class="delivery--empty">Er wordt vandaag niks afgeleverd</div>}
        keyed
      >
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
              <th>Duur(in tijdslots)</th>
              <th>Betaald</th>
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
                <td>{order.duration}</td>
                <td>{order.paid ? "ja" : "nee"}</td>
              </tr>
            ))}
            </tbody>
        </table>
        </Show>
    </div>
    );
};

export default Delivery;
