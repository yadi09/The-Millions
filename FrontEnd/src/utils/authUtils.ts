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
