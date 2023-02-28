import { createStore } from 'solid-js/store';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc} from "firebase/firestore";
import { errAsync, okAsync, ResultAsync} from "neverthrow";

import {orderBrand, orderBodyType, orderColor, orderPlan, orderStatus} from "./orderTypes";
import {firestore} from "firebase-admin";
const db = getFirestore();
const auth = getAuth();

type FormFields = {
    brand: orderBrand;
    model: string;
    bodyType: orderBodyType;
    color: orderColor;
    licensePlate: string;
    date: string; // iso date string
    plan: orderPlan;
    isRush: boolean;
};

type BackendFormFields = {
    createdAt: firestore.Timestamp;
    userId: string;
    status: orderStatus;
    duration: number;
    hasPaid: boolean;
}


async function submit(form: FormFields): Promise<ResultAsync<Boolean, Error>> {
    /***
     * submit the order form, do form validation and save the order to the database
     */
    const formData = {
        brand: form.brand,
        model: form.model,
        bodyType: form.bodyType,
        color: form.color,
        licensePlate: form.licensePlate,
        plan: form.plan,
        date: form.date,
        isRush: form.isRush,
    }

    // form validation
    if (Object.values(formData).some((value) => value === '')) {
        // skip
        return errAsync(new Error('All fields are required'));
    } else if (formData.brand == orderBrand.other) {
        return errAsync(new Error('Please select a brand'));
    } else if (formData.bodyType == orderBodyType.other) {
        return errAsync(new Error('Please select a body type'));
    }

    // check date
    const date = new Date(formData.date);
    if (date < new Date()) {
        return errAsync(new Error('Date must be in the future'));
    }

    // check if we have an open slot for that day
    const scheduleRef = doc(db, "schedule", formData.date);
    const schedule = await getDoc(scheduleRef);
    const data = schedule.data();
    if (data?.slots_available <= 0) {
        return errAsync(new Error('No open slots for that day'));
    }

    // all the data that the user should not be able to change
    const backendData: BackendFormFields = {
        createdAt: serverTimestamp() as firestore.Timestamp,
        userId: auth.currentUser!.uid,
        status: orderStatus.pending,
        duration: -1,
        hasPaid: false,
    }

    const dataToSubmit = {...formData, ...backendData};
    addDoc(collection(db, "orders"), dataToSubmit)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
                return errAsync(new Error(error.message));
            }
    )

    // clear the fields


    return okAsync(true);
}


function useForm() {
    /***
     * This hook handles the form state and form submission
     * It uses the solid store to keep track of the form state
     * @returns {form, submit, clearField, updateFormField}
     */
    const [form, setForm] = createStore<FormFields>({
        brand: orderBrand.other,
        model: '',
        bodyType: orderBodyType.other,
        color: orderColor.black,
        licensePlate: '',
        plan: orderPlan.bronze,
        // get tomorrow's date as iso string
        date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        isRush: false,
    });

    const clearField = (fieldName: keyof FormFields) => {
        setForm({[fieldName]: ''});
    }

    const clearForm = () => {
        setForm({
            brand: orderBrand.other,
            model: '',
            bodyType: orderBodyType.other,
            color: orderColor.black,
            licensePlate: '',
            plan: orderPlan.bronze,
            // get tomorrow's date as iso string
            date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            isRush: false,
        });
    }

    const updateFormField = (fieldName: keyof FormFields) => {
        return (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.type === 'checkbox') {
                setForm({[fieldName]: target.checked});
            } else {
                setForm({[fieldName]: target.value});
            }
        }
    }

    return {
        form,
        submit,
        clearField,
        updateFormField,
        clearForm,
    };
}

export default useForm;