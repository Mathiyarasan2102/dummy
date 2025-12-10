import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
