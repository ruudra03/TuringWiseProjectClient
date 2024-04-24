import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Get all users API endpoint
        getUsers: builder.query({
            query: () => '/users', // Base Query is already provided inside apiSlice
            validateStatus: (response, result) => { // Check response status
                return response.status === 200 && !result.isError
            },
            // TODO: change keepUnusedDataFor value (which is in seconds) after deployment
            keepUnusedDataFor: 5, // 5secs for development and usually 60secs for deployment
            transformResponse: responseData => { // Due to usage of _id instead of id property in MongoDB responses
                const loadedUsers = responseData.map(user => {
                    user.id = user._id // Map _id to id property
                    return user
                })

                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) { // Check for id property
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }] // Fail Safe
            }
        })
    })
})

export const {
    // Create hooks (add use in the beginning and Query at the end)
    useGetUsersQuery
} = usersApiSlice

// Selectors
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select() // Returns Query Result object

const selectUsersData = createSelector( // Create Memorised selector
    selectUsersResult,
    usersResult => usersResult.data // Normalised State object with IDs & Entities
)

export const { // getSelectors creates these selectors
    // Rename selectors with aliases using destructuring
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)