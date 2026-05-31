/**
 * Authentication utility functions for token management
 * Handles localStorage operations for JWT tokens
 */

const TOKEN_KEY = 'token';

/**
 * Retrieve the JWT token from localStorage
 * @returns The token string or null if not found
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Save the JWT token to localStorage
 * @param token - The JWT token to store
 */
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the JWT token from localStorage
 * Used during logout
 */
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if a valid token exists
 * @returns true if token exists, false otherwise
 */
export const hasToken = (): boolean => {
    return !!getToken();
};

/**
 * Decode the JWT payload and check whether it's past its `exp` timestamp.
 * Returns true if no token, malformed token, or expired.
 * Returns false only when a token is present AND `exp` is in the future
 * (or `exp` is missing — treat as non-expiring).
 */
export const isTokenExpired = (): boolean => {
    const token = getToken();
    if (!token) return true;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};

/** Convenience: token present AND not expired. */
export const hasValidToken = (): boolean => !isTokenExpired();

/** Clear local auth state. Use before any redirect to /admin/login. */
export const clearAuth = (): void => {
    removeToken();
};
