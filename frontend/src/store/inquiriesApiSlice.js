import { apiSlice } from './apiSlice';

export const inquiriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createInquiry: builder.mutation({
            query: (data) => ({
                url: '/inquiries',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Inquiry'],
        }),
        getAgentInquiries: builder.query({
            query: () => ({
                url: '/inquiries/agent',
            }),
            providesTags: ['Inquiry'],
            keepUnusedDataFor: 5,
        }),
        getUserInquiries: builder.query({
            query: () => ({
                url: '/inquiries/my',
            }),
            providesTags: ['Inquiry'],
            keepUnusedDataFor: 5,
        }),
        updateInquiryStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/inquiries/${id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Inquiry'],
        }),
    }),
});

export const {
    useCreateInquiryMutation,
    useGetAgentInquiriesQuery,
    useGetUserInquiriesQuery,
    useUpdateInquiryStatusMutation,
} = inquiriesApiSlice;
