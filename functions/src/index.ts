import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();


exports.onOrderCreated = functions.firestore
    .document("orders/{orderId}")
    .onCreate((snap, __context) => {
        const data = snap.data();
        console.log('Order created: ', data);
        return null;
    });
