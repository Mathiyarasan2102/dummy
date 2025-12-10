import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        googleLogin: builder.mutation({
            query: (data) => ({
                url: '/auth/google',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: '/auth/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        getWishlist: builder.query({
            query: () => '/users/wishlist',
            keepUnusedDataFor: 5,
        }),
        toggleWishlist: builder.mutation({
            query: (propertyId) => ({
                url: `/users/wishlist/${propertyId}`,
                method: 'PUT',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGoogleLoginMutation,
    useLogoutMutation,
    useUpdateUserMutation,
    useGetWishlistQuery,
    useToggleWishlistMutation
} = usersApiSlice;
