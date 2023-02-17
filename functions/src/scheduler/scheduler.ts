// create documents for each day of the week that contain 10 slots
// whenever an order is created, check if there is a slot available
// if there is a slot available, add the order to the slot
// if there is no slot available, add the order to the next day

import * as admin from "firebase-admin";

// docs: https://firebase.google.com/docs/functions/callable#web-version-9_2

// document outline:
/*
* - Day, timestamp
* - Slots_available, number (default 10)
* - Array of 10 slots, each containing:
*       -order_id, string
* */


// create a new document for a schedule day
async function createScheduleDay(batch: admin.firestore.WriteBatch, date: Date) {
    console.log("creating schedule day...");
    const slots = 10;

    await admin.firestore().collection("schedule").doc(date.toDateString()).set({
        slots_available: slots,
        slots: Array(slots).fill({order_id: ""})
    });
}


async function getNextAvailableDay(batch: admin.firestore.WriteBatch): Promise<Date> {
    console.log("getting next available day...");
    // get the current day
    const today = new Date();

    // get the next day
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    // get the schedule for the next day
    const scheduleRef = admin.firestore().collection("schedule").doc(nextDay.toDateString())
    const data = await scheduleRef.get()
    if (data.exists) {
        const snapshot = data.data()
        if (snapshot) {
            const slotsAvailable = snapshot.slots_available;
            if (slotsAvailable > 0) {
                return nextDay;
            }
        }
    }

    // if there is no schedule for the next day, create one
    await createScheduleDay(batch, nextDay);

    return nextDay;
}


async function getNextAvailableSlot(date: Date): Promise<number> {
    console.log("getting next available slot...");
    // get the schedule for the day
    const scheduleRef = admin.firestore().collection("schedule").doc(date.toDateString());
    if (scheduleRef) {
        console.log("we have a schedule ref");
        const data = await scheduleRef.get();
        const snapshot = data.data();
        if (snapshot) {
            console.log("we have a snapshot");
            const slotsAvailable = snapshot.slots_available;
            const slots = snapshot.slots;

            // if there are slots available, return the first available slot
            if (slotsAvailable > 0) {
                for (let i = 0; i < slots.length; i++) {
                    if (slots[i].order_id === "") {
                        return i;
                    }
                }
            }
        }
    }

    throw new Error("Error getting next available slot.");
}


async function addOrderToSlot(batch: admin.firestore.WriteBatch, date: Date, slot: number, order_id: string) {
    console.log("adding order to slot...");
    const scheduleRef = admin.firestore().collection("schedule").doc(date.toDateString());
    if (scheduleRef) {
        const data = await scheduleRef.get()
        const snapshot = data.data()
        if (snapshot) {
            const slotsAvailable = snapshot.slots_available;
            const slots = snapshot.slots;

            // add the order to the slot
            slots[slot].order_id = order_id;

            // update the slots_available
            const newSlotsAvailable = slotsAvailable - 1;

            await scheduleRef.update({
                slots_available: newSlotsAvailable,
                slots: slots,
            });
        }
    }
}


export default async function scheduleOrder(batch: admin.firestore.WriteBatch, orderId: string, duration: number) {
    console.log("scheduling order...");
    while (duration > 0) {
        // get the next available day
        const nextDay = await getNextAvailableDay(batch);

        // get the next available slot
        const nextSlot = await getNextAvailableSlot(nextDay);

        // add the order to the slot
        await addOrderToSlot(batch, nextDay, nextSlot, orderId);

        // decrement the duration
        duration--;
    }
}
