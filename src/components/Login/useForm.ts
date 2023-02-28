import {createStore} from 'solid-js/store';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

import {errAsync, okAsync, ResultAsync} from "neverthrow";

type FormFields = {
    email: string;
    password: string;
};

const auth = getAuth();

async function submit(form: FormFields): Promise<ResultAsync<Boolean, Error>> {
    /***
     * submit the login form, check if the user exists and if the password is correct
     * then log in the user
     * @param form the form data as a FormFields object
     * @returns a ResultAsync object
     */

    const data = {
        email: form.email,
        password: form.password,
    }

    // form validation
    if (data.email === '') {
        return errAsync(new Error('Email/password is required'));
    }
    if (data.password === '') {
        return errAsync(new Error('Password is required'));
    }

    signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
        })
        .catch((error) => {
            return errAsync(new Error(error.message + ' ' + error.code));
        });

    return okAsync(true);
}

function useForm() {
    /***
     * A custom hook to handle the login form,
     * it uses the solid-js/store to manage the form state
     * @returns an object with the form state, a function to update the form state,
     * a function to submit the form and a function to set the form state
     */

    const [form, setForm] = createStore<FormFields>({
        email: '',
        password: '',
    });
    
    function updateFormField(fieldName: keyof FormFields) {
        /***
         * A function to update the form state
         * @param fieldName the name of the field to update
         * @returns a function that takes an event and updates the form state
         */
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
        setForm,
        updateFormField,
        submit,
    };
}

export default useForm;