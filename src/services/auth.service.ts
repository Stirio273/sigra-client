// src/services/auth.service.ts

import type { User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

export const authService = {
    /**
     * Calls the backend to verify Kerberos authentication
     * and retrieve current user info
     */
    getCurrentUser: async (): Promise<User> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (MOCK_USER_EMAIL) {
            headers['X-Mock-User'] = MOCK_USER_EMAIL;
        }

        const response = await fetch(`${API_URL}/Authentication/profile`, {
            method: 'GET',
            credentials: 'include', // Required for Kerberos
            headers,
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
