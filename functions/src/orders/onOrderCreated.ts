import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import calculateDuration from "./calculateDuration";
import scheduleOrder from "../scheduler/scheduler";

export default functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
        const orderData = snap.data();
        const orderId = context.params.orderId;

        const batch = admin.firestore().batch();

        const duration = calculateDuration(orderData);
        batch.update(snap.ref, {duration: duration});

        await scheduleOrder(batch, orderId, duration);

        try {
            await batch.commit();
            await snap.ref.set({status: "scheduled"}, {merge: true});
        } catch (e) {
            console.error(e);
        }
    });
