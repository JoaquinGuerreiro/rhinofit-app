import { loadMercadoPago } from "@mercadopago/sdk-js";

// Configuración inicial de Mercado Pago
const MP_PUBLIC_KEY = 'TEST-b6e136b7-2b80-4960-9caa-89bd1b8f2f34';
const API_URL = import.meta.env.PROD 
    ? 'https://rhinofit-payment-server.onrender.com' 
    : 'http://localhost:3000';

export async function initMercadoPago() {
    try {
        await loadMercadoPago();
        const mp = new window.MercadoPago(MP_PUBLIC_KEY);
        return mp;
    } catch (error) {
        console.error('Error inicializando MercadoPago:', error);
        throw new Error('Error al inicializar el método de pago');
    }
}

export async function createPreference() {
    try {
        const response = await fetch(`${API_URL}/create-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Error al crear la preferencia');
        }

        const preference = await response.json();
        return preference;
    } catch (error) {
        console.error('Error creando preferencia:', error);
        throw error;
    }
}

export async function verifyPaymentToken(token) {
    try {
        const response = await fetch(`${API_URL}/verify-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        return data.valid;
    } catch (error) {
        console.error('Error verificando token de pago:', error);
        return false;
    }
}