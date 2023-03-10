/***
 * This file is triggered when a new order is created.
 * It calculates the duration of the order and schedules it with a transaction.
 */
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

        await admin.firestore().runTransaction(async (transaction) => {
            await scheduleOrder(transaction, orderId, orderStartDate, duration);
        }).then(() => {
            functions.logger.log("Order scheduled successfully.");
            return snap.ref.set({status: "scheduled"}, {merge: true});
        }).catch((e) => {
            return functions.logger.error("Error scheduling order: ", e);
        });
    });
