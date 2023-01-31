/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import { Router, Route, Routes } from '@solidjs/router';

// import './index.css';

render(
    () => (
        <Router>
            <Routes>
                <Route path="/" component={App} />
            </Routes>
        </Router>
    ),
    document.getElementById('root') as HTMLElement
);
