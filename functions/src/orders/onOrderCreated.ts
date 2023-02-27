import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import calculateDuration from "./calculateDuration";
import scheduleOrder from "../scheduler/scheduler";

export default functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
        const orderData = snap.data();
        const orderId = context.params.orderId;
        const orderStartDate = orderData.date; // iso date string

        const duration = calculateDuration(orderData);

        try {
            await admin.firestore().runTransaction(async (transaction) => {
                await scheduleOrder(transaction, orderId, orderStartDate, duration);
            });

            await snap.ref.set({status: "scheduled"}, {merge: true});
        } catch (e) {
            console.error(e);
        }

        return;
    });
