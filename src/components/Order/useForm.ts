import { createStore } from 'solid-js/store';
import { User } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp} from "firebase/firestore";

const db = getFirestore();

type FormFields = {
    brand: string;
    model: string;
    bodyType: string;
    color: string;
    licensePlate: string;
    plan: string;
    createdAt: string;
    userId: string;
    status: string;
    duration: number;
};


const submit = async (form: FormFields) => {
    const dataToSubmit = {
        brand: form.brand,
        model: form.model,
        bodyType: form.bodyType,
        color: form.color,
        licensePlate: form.licensePlate,
        plan: form.plan,
        createdAt: serverTimestamp(),
        userId: form.userId,
        status: form.status ? 'urgent' : 'pending',
        duration: -1,
    }

    // form validation
    if (
        Object.values(dataToSubmit).some((value) => value === '')
    ) {
        return false;
    }

    try {
        const docRef = await addDoc(collection(db, "orders"), dataToSubmit);
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}


const useForm = (user: User) => {
    const [form, setForm] = createStore<FormFields>({
        brand: '',
        model: '',
        bodyType: '',
        color: '',
        licensePlate: '',
        plan: '',
        createdAt: '',
        userId: user.uid,
        status: 'pending',
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