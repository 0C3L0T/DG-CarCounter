/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import { Router, Route, Routes } from '@solidjs/router';
// link to other pages using the 'A' component of the router

import { lazy } from 'solid-js';

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyAHL3a8NgIR31S97JHsAu2fG_1EMy2jb7o",
    authDomain: "test-app-dd032.firebaseapp.com",
    projectId: "test-app-dd032",
    storageBucket: "test-app-dd032.appspot.com",
    messagingSenderId: "229925355235",
    appId: "1:229925355235:web:4fe2a98d0769b1a034cfd6"
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
connectFirestoreEmulator(db, 'localhost', 8080);

const Order = lazy(() => import('./components/Order'));
const Overview = lazy(() => import('./components/Overview'));


render(
    () => (
        <Router>
            <Routes>
                <Route path="/" component={App} />
                <Route path="/order" component={Order} />
                <Route path="/overview" component={Overview} />
            </Routes>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
