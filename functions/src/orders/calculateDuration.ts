import { DocumentData } from "firebase/firestore";

export default function CalculateDuration(order: DocumentData): number {
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

        if (order.isRush) {
            duration -= 1;
        }

        return duration;
    } else {
        return -1
    }
}