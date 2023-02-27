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


async function getNextAvailableSlotAfter(
    schedules: { [date: string]: Schedule },
    start: string // iso date string
): Promise<[string, number]> {
    /***
     * Returns the next available slot in the schedule on the start date
     * or the next day if the start date is not in the schedule or the slots are full
     * @param schedules the schedules dict
     * @param start the start date in iso format
     * @returns [date, slot] where date is the date in iso format and slot is the slot number
     */

    // check if the date is in the schedule
    if (schedules[start]) {
        // check if there are slots available
        if (schedules[start].slots_available > 0) {
            // get the first slot that is empty
            for (let i = 0; i < schedules[start].slots.length; i++) {
                if (schedules[start].slots[i] === "") {
                    return [start, i];
                }
            }
        }
        // date is full, check next day
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        return getNextAvailableSlotAfter(schedules, nextDay.toISOString().slice(0, 10));
    }

    // date not in the schedule, we can create it
    return [start, 0];
}


async function buildScheduleDict(): Promise<{ [date: string]: Schedule }> {
    /***
     * Builds a dict of schedule objects from the database
     * @returns a dict of all the schedules in the database
     */

    const schedules: { [date: string]: Schedule } = {};

    // get the last schedule with slots available
    const scheduleRef = admin.firestore().collection("schedule");
    const scheduleQuery = await scheduleRef.limit(1).get();

    // if there is a latest schedule, add it to the schedules object
    if (!scheduleQuery.empty) {
        const lastSchedule = scheduleQuery.docs[0];
        schedules[lastSchedule.id] =
            new Schedule(lastSchedule.data().slots, lastSchedule.data().slots_available);
    }

    return schedules;
}


export default async function scheduleOrder(
    transaction: admin.firestore.Transaction,
    orderId: string,
    orderStartDate: string,
    duration: number
) {
    /***
     * Schedule an order on the database via a transaction
     * @param transaction the transaction object
     * @param orderId the order id
     * @param orderStartDate the order start date in iso format
     * @param duration the duration of the order in time slots
     * @returns
     */

    const duration_copy = duration;

    const orderRef = admin.firestore().collection("orders").doc(orderId);
    const order = await transaction.get(orderRef);

    if (!order.exists) {
        throw new Error("Order does not exist.");
    }

    const schedules = await buildScheduleDict();

    // now we can use the schedules object to add new orders to the schedule
    while (duration > 0) {
        // get the next available slot
        const [date, slot] = await getNextAvailableSlotAfter(schedules, orderStartDate);

        // add the order to the slot and store in intermediate object
        if (schedules[date]) {
            // add order to the existing schedule
            schedules[date].addOrderToSlot(slot, orderId);
        } else {
            // create new schedule
            const slots: [] = Array(10).fill("") as [];
            schedules[date] = new Schedule(slots, 10);
            schedules[date].addOrderToSlot(slot, orderId);
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
