import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: 'include', // Include cookies in requests
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            console.log('API Request - Token:', token ? 'Present' : 'Missing');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['User', 'Property', 'Inquiry'],
    endpoints: (builder) => ({}) // Extended in slice files
});
