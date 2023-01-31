/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import { Router, Route, Routes } from '@solidjs/router';
// link to other pages using the 'A' component of the router

import { lazy } from 'solid-js';
const Order = lazy(() => import('./components/Order'));



render(
    () => (
        <Router>
            <Routes>
                <Route path="/" component={App} />
                <Route path="/order" component={Order} />
            </Routes>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
