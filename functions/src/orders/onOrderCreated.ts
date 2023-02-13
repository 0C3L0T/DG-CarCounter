import { firestore } from "firebase-functions";
import calculateDuration from "./calculateDuration";


export default firestore
    .document("orders/{orderId}")
    .onCreate((snap, __context) => {
        const data = snap.data();

        // calculate how long the order will take to complete
        const result = calculateDuration(data);
        if (result !== -1) {
            return snap.ref.set({duration: result}, {merge: true});
        } else {
            return snap.ref.set({status: "Invalid order"}, {merge: true});
        }

        // schedule the order
    });
