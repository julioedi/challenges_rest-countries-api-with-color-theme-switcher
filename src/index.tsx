import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { defaultCookies } from '@root/utilities/cookies';
import { api } from './utilities/countriesApi';

const divroot = document.getElementById('root') as HTMLDivElement | null;
// root.render(<App />);
(async () => {
    await api.init();
    if (!api.data) {
        const errorMessage = "Something failed trying to load countries";
        if (!divroot) {
            document.body.innerHTML = `<div id="root"><h1>${errorMessage}</h1></div>`;
        }
        return;
    }
    const root = ReactDOM.createRoot(divroot!);
    root.render(<App />);
})()
