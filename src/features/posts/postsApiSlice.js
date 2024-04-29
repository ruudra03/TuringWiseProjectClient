import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

// TODO: add post sorting inside createEntityAdapter
const postsAdapter = createEntityAdapter({})

const initialState = postsAdapter.getInitialState()

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Get all posts API endpoint
        getPosts: builder.query({
            query: () => ({
                url: '/posts', // Base Query is already provided inside apiSlice
                validateStatus: (response, result) => { // Check response status
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: responseData => { // Due to usage of _id instead of id property in MongoDB responses
                const loadedPosts = responseData.map(post => {
                    post.id = post._id // Map _id to id property
                    return post
                })

                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) { // Check for id property
                    return [
                        { type: 'Post', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Post', id }))
                    ]
                } else return [{ type: 'Post', id: 'LIST' }] // Fail Safe
            }
        }),
        // Create New Post
        addNewPost: builder.mutation({
            query: initialPostData => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPostData
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: 'LIST' }
            ]
        }),
        // Update Post
        updatePost: builder.mutation({
            query: initialPostData => ({
                url: '/posts',
                method: 'PATCH',
                body: {
                    ...initialPostData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        // Delete Post
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: '/posts',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        })
    })
})

export const {
    // Create hooks (add use in the beginning and Query/Mutation at the end)
    useGetPostsQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation
} = postsApiSlice

// Selectors
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select() // Returns Query Result object

const selectPostsData = createSelector( // Create Memorised selector
    selectPostsResult,
    postsResult => postsResult.data // Normalised State object with IDs & Entities
)

export const { // getSelectors creates these selectors
    // Rename selectors with aliases using destructuring
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)