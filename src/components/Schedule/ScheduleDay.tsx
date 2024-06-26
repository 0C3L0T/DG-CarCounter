import type { Component } from "solid-js";
import { createResource, createSignal, Show } from "solid-js";
import type { DocumentData } from "firebase/firestore";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { For } from "solid-js/web";

import "./scheduleDay.scss";

const db = getFirestore();

const ScheduleDay: Component<{ date: Date }> = (props) => {
  const scheduleRef = doc(db, "schedule", props.date.toISOString().slice(0, 10));

  const [orderIds, setOrderIds] = createSignal<string[]>([]);
  onSnapshot(scheduleRef, (scheduleSnapshot) => {
    const data = scheduleSnapshot.data();
    const _orderIds: string[] = [];
    data?.slots?.map((slot: DocumentData) => {
      _orderIds.push(slot.toString());
    });
    setOrderIds(_orderIds);
  });

  const [orders] = createResource(orderIds, async (orderIds) => {
    const orders = orderIds.map(async (orderId) => {
      if (orderId == "") {
        return null;
      }
      const order = await getDoc(doc(db, "orders", orderId));
      if (order.exists()) {
        return order.data();
      }
    });
    return Promise.all(orders);
  });

  const expandInfo = (e: Event) => {
    const target = e.target as HTMLElement;
    const row = target.parentElement?.parentElement as HTMLElement;
    row.classList.toggle("expanded");
  };

  return (
    <div class="table-view table-view--expandable">
      <h1>Werkorders voor {props.date.toLocaleDateString("nl-NL")}</h1>
      <Show
        when={!orders.loading && orders()!.length != 0}
        fallback={<div class="table-view--empty">Er zijn nog geen orders</div>}
        keyed
      >
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Merk</th>
              <th>Type</th>
              <th>Carroserie</th>
              <th>Kenteken</th>
            </tr>
          </thead>
          <tbody>
            <For each={orders()}>
              {(order) => (
                <Show
                  when={order != null}
                  fallback={
                    <>
                      <tr>
                        <td></td>
                        <td colSpan={4} class="open-slot">
                          Open slot
                        </td>
                      </tr>
                      <tr class="expandable"></tr>
                    </>
                  }
                  keyed
                >
                  <tr>
                    <td>
                      <div class="chevron" onClick={expandInfo}></div>
                    </td>
                    <td>{order!.brand}</td>
                    <td>{order!.model}</td>
                    <td>{order!.bodyType}</td>
                    <td>{order!.licensePlate.toUpperCase()}</td>
                  </tr>
                  <tr class="expandable">
                    <td colSpan={5}>
                      <div class="extra-info table-view table-view--inset" aria-colspan={5}>
                        <table>
                          <thead>
                            <tr>
                              <th>Kleur</th>
                              <th>Behandeling</th>
                              <th>Status</th>
                              <th>Betaald</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{order!.color}</td>
                              <td>{order!.plan}</td>
                              <td>{order!.status}</td>
                              <td>{order!.hasPaid ? "ja" : "nee"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </Show>
              )}
            </For>
          </tbody>
        </table>
      </Show>
    </div>
  );
};

export default ScheduleDay;
