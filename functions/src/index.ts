import * as admin from 'firebase-admin';
admin.initializeApp();

import onOrderCreated from "./orders/onOrderCreated";

export {
    onOrderCreated,
};