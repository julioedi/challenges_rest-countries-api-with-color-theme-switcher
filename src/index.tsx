import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { defaultCookies } from '@root/utilities/cookies';
import { api } from './utilities/countriesApi';

// const root = ReactDOM.createRoot(document.getElementById('root')!);
const root = document.getElementById('root') as HTMLDivElement | null;
// root.render(<App />);
(async () => {
    await api.init();
    // if (!api.data) {
        const errorMessage = "Something failed trying to load countries";
        if (!root) {
            document.body.innerHTML = `<div id="root"><h1>${errorMessage}</h1></div>`;
        }
    // }
    
})()
