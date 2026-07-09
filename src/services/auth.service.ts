// src/services/auth.service.ts

import type { User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
    /**
     * Calls the backend to verify Kerberos authentication
     * and retrieve current user info
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await fetch(`${API_URL}/api/Authentication`, {
            method: 'GET',
            credentials: 'include', // Required for Kerberos
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            throw new Error('UNAUTHORIZED');
        }

        if (response.status === 403) {
            throw new Error('FORBIDDEN');
        }

        if (!response.ok) {
            throw new Error('AUTH_CHECK_FAILED');
        }

        return response.json();
    },
};
