import { createStore } from 'solid-js/store';
import { User } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp} from "firebase/firestore";
import { errAsync, okAsync, ResultAsync} from "neverthrow";

import {orderBrand, orderBodyType, orderColor, orderPlan, orderStatus} from "./orderTypes";
const db = getFirestore();




type FormFields = {
    brand: orderBrand;
    model: string;
    bodyType: orderBodyType;
    color: orderColor;
    licensePlate: string;
    plan: orderPlan;
    createdAt: null | string;
    userId: string;
    status: orderStatus;
    duration: number;
};


async function submit(form: FormFields): Promise<ResultAsync<Boolean, Error>> {
    const dataToSubmit = {
        brand: form.brand,
        model: form.model,
        bodyType: form.bodyType,
        color: form.color,
        licensePlate: form.licensePlate,
        plan: form.plan,
        createdAt: serverTimestamp(),
        userId: form.userId,
        status: form.status ? orderStatus.urgent : orderStatus.pending,
        duration: -1,
    }

    // form validation
    if (Object.values(dataToSubmit).some((value) => value === '')) {
        return errAsync(new Error('All fields are required'));
    } else if (dataToSubmit.brand == orderBrand.other) {
        return errAsync(new Error('Please select a brand'));
    } else if (dataToSubmit.bodyType == orderBodyType.other) {
        return errAsync(new Error('Please select a body type'));
    }

    addDoc(collection(db, "orders"), dataToSubmit)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
                return errAsync(new Error(error.message));
            }
    )

    return okAsync(true);
}


const useForm = (user: User) => {
    const [form, setForm] = createStore<FormFields>({
        brand: orderBrand.other,
        model: '',
        bodyType: orderBodyType.other,
        color: orderColor.black,
        licensePlate: '',
        plan: orderPlan.bronze,
        createdAt: '',
        userId: user.uid,
        status: orderStatus.pending,
        duration: -1,
    });

    const clearField = (fieldName: keyof FormFields) => {
        setForm({[fieldName]: ''});
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
    };
}

export default useForm;