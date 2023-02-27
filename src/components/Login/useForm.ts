import {createStore} from 'solid-js/store';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

import {errAsync, okAsync, ResultAsync} from "neverthrow";

type FormFields = {
    email: string;
    password: string;
};

const auth = getAuth();

async function submit(form: FormFields): Promise<ResultAsync<Boolean, Error>> {

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
            const errorCode = error.code;
            return errAsync(new Error(error.message + ' ' + errorCode));
        });

    return okAsync(true);
}

function useForm() {
    const [form, setForm] = createStore<FormFields>({
        email: '',
        password: '',
    });


    function updateFormField(fieldName: keyof FormFields) {
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