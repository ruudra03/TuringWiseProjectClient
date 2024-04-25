import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Get all users
        getUsers: builder.query({
            query: () => '/users', // Base Query is already provided inside apiSlice
            validateStatus: (response, result) => { // Check response status
                return response.status === 200 && !result.isError
            },
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
        }),
        // Create New User
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }),
        // Update User
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        // Delete User
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        })
    })
})

export const {
    // Create hooks (add use in the beginning and Query/Mutation at the end)
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
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