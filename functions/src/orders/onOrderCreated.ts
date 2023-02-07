import * as functions from "firebase-functions";

/**
 * Calculate the duration of the order in days, return -1 if the order is not found
 * @param snap
 * @constructor
 */
function CalculateDuration(snap: functions.firestore.DocumentSnapshot): number {
    const order = snap.data();
    let duration = 0;

    if (order) {
        switch (order.plan) {
            case "bronze":
                duration += 1;
                break;
            case "silver":
                duration += 2;
                break;
            case "gold":
                duration += 3;
                break;
            default:
                return -1; // invalid plan
        }

        if (order.color === "black") {
            duration += 1;
        }

        if (order.body === "suv") {
            duration += 1;
        }

        return duration;
    } else {
        return -1
    }
}

export default functions.firestore
    .document("orders/{orderId}")
    .onCreate((snap, __context) => {
        const currentTime: number = Date.now();
        // console.log('Order created: ', currentTime)
        // console.log('Order created: ', snap.ref)
        const duration = CalculateDuration(snap);
        if (duration === -1) {
            return snap.ref.set({error: "Invalid order"}, {merge: true});
        }
        return snap.ref.set({
                created_at: currentTime,
                duration: duration,
            },
            {merge: true}
        );
    });
