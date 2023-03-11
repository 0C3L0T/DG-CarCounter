import * as admin from 'firebase-admin';
admin.initializeApp();

import onOrderCreated from "./orders/onOrderCreated";
import removeOrder from "./orders/removeOrder";

export {
    onOrderCreated,
    removeOrder,
};