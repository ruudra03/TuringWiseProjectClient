import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { setCredentials } from './authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set('authorization', `Bearer ${token}`) // can use "Authorization" (because we are checking for both)
        }

        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions) // calling baseQuery here

    // Failed to get baseQuery()
    // Try to check if refresh token is present i.e., if "Trust Device" is selected; persist is true
    if (result?.error?.status === 403) {
        console.log('Sending refresh token')
        const refreshResult = baseQuery('/auth/refresh', api, extraOptions) // Get new access token

        if (refreshResult?.data) {
            // Set API Credentials
            api.dispatch(setCredentials({ ...refreshResult.data })) // Store the new access token

            // Retry baseQuery() with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login access has expired.'
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Article', 'Post'],
    endpoints: builder => ({})
})