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

class Schedule {
    slots: string[];
    slots_available: number;

    constructor(slots: string[], slots_available: number = 10) {
        this.slots = slots;
        this.slots_available = slots_available;
    }

    addOrderToSlot = (slot: number, order_id: string) => {
        this.slots[slot] = order_id;
        this.slots_available -= 1;
    }
}

async function getNextAvailableSlot(schedules: { [date: string]: Schedule }): Promise<[Date, number]> {
    // get the first schedule with slots available
    for (const date in schedules) {
        const schedule = schedules[date];
        if (schedule.slots_available > 0) {
            // get the first slot that is empty
            for (let i = 0; i < schedule.slots.length; i++) {
                if (schedule.slots[i] === "") {
                    return [new Date(date), i];
                }
            }
        }
    }

    // if no slots are available, we can create a new schedule for the next day
    const lastScheduleDate = new Date(Object.keys(schedules)[Object.keys(schedules).length - 1]);
    const nextScheduleDate = new Date(lastScheduleDate);
    nextScheduleDate.setDate(nextScheduleDate.getDate() + 1);

    return [nextScheduleDate, 0];
}

export default async function scheduleOrder(transaction: admin.firestore.Transaction, orderId: string, duration: number) {
    console.log("scheduling order...");

    const duration_copy = duration;

    const orderRef = admin.firestore().collection("orders").doc(orderId);
    const order = await transaction.get(orderRef);

    if (!order.exists) {
        throw new Error("Order does not exist.");
    }

    const schedules: { [date: string]: Schedule } = {};
    // fill schedule object with all the dates and slots from transaction
    // get the last schedule with slots available
    const scheduleRef = admin.firestore().collection("schedule");
    const scheduleQuery = await scheduleRef.limit(1).get();
    if (!scheduleQuery.empty) {
        const lastSchedule = scheduleQuery.docs[0];
        console.log("last schedule: ", lastSchedule.data());
        schedules[lastSchedule.id] = new Schedule(lastSchedule.data().slots, lastSchedule.data().slots_available);
    } else {
        // if there are no schedules, create a new one
        schedules[new Date().toDateString()] = new Schedule(Array(10).fill("") as []);
    }

    // now we can use the schedules object to add new orders to the schedule

    while (duration > 0) {
        // get the next available slot
        const [date, slot] = await getNextAvailableSlot(schedules);

        // add the order to the slot and store in intermediate object
        if (schedules[date.toDateString()]) {
            // add order to existing schedule
            schedules[date.toDateString()].addOrderToSlot(slot, orderId);
        } else {
            // create new schedule
            const slots: [] = Array(10).fill("") as [];
            schedules[date.toDateString()] = new Schedule(slots, 10);
            schedules[date.toDateString()].addOrderToSlot(slot, orderId);
        }

        duration--;
    }

    // writing part
    // iterate over intermediate object and write to db
    for (const date in schedules) {
        const schedule = schedules[date];
        const scheduleRef = admin.firestore().collection("schedule").doc(date);
        transaction.set(scheduleRef, {
            slots: schedule.slots,
            slots_available: schedule.slots_available,
        });
    }

    // update the order status
    transaction.update(orderRef, {status: "scheduled", duration: duration_copy});
}
