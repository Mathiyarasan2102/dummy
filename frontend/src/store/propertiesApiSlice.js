import { apiSlice } from './apiSlice';

export const propertiesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProperties: builder.query({
            query: (params) => ({
                url: '/properties',
                params
            }),
            keepUnusedDataFor: 5,
        }),
        getProperty: builder.query({
            query: (slug) => ({
                url: `/properties/${slug}`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useGetPropertiesQuery, useGetPropertyQuery } = propertiesApiSlice;
