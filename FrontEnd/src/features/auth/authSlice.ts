import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, removeToken, getToken } from '../../utils/authUtils';

/**
 * Authentication API slice using RTK Query
 * Handles login + credential-change requests
 */
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Login mutation - POST /auth/login
        login: builder.mutation<
            { token: string; user: { email: string } },
            { email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    setToken(data.token);
                    dispatch(setCredentials({ user: data.user, token: data.token }));
                } catch {
                    // Component handles errors
                }
            },
        }),

        // Change the authenticated admin's password
        changePassword: builder.mutation<
            { message: string },
            { currentPassword: string; newPassword: string }
        >({
            query: (body) => ({
                url: '/auth/change-password',
                method: 'POST',
                body,
            }),
        }),

        // Change the authenticated admin's email — returns a fresh JWT
        changeEmail: builder.mutation<
            { token: string; user: { id: string; email: string } },
            { currentPassword: string; newEmail: string }
        >({
            query: (body) => ({
                url: '/auth/change-email',
                method: 'POST',
                body,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    setToken(data.token);
                    dispatch(setCredentials({ user: { email: data.user.email }, token: data.token }));
                } catch {
                    // Component handles errors
                }
            },
        }),
    }),
});

/**
 * Authentication state slice
 * Manages user authentication status and user info
 */
interface AuthState {
    user: { email: string } | null;
    token: string | null;
    isAuthenticated: boolean;
}

// Initialize state - check if token exists in localStorage
const initialState: AuthState = {
    user: null,
    token: getToken(),
    isAuthenticated: !!getToken(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set user credentials after successful login
        setCredentials: (
            state,
            action: PayloadAction<{ user: { email: string }; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        // Clear credentials on logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            // Remove token from localStorage
            removeToken();
        },
    },
});

// Export actions
export const { setCredentials, logout } = authSlice.actions;

// Export reducer
export const authReducer = authSlice.reducer;

// Export hooks for components
export const {
    useLoginMutation,
    useChangePasswordMutation,
    useChangeEmailMutation,
} = authApi;
