import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { api } from './utilities/countriesApi';

const divroot = document.getElementById('root') as HTMLDivElement | null;
(async () => {
    await api.init();
    const root = ReactDOM.createRoot(divroot!);
    root.render(<App />);
})()
