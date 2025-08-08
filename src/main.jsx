import React from 'react'
import { createRoot } from 'react-dom/client'; // ← CAMBIO: Agregar '/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './core/auth/context/AuthContext.jsx'

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
    // ← CAMBIO: Quitar el segundo parámetro document.getElementById('root')
);