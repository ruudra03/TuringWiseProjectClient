import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

const articlesAdapter = createEntityAdapter({})

const initialState = articlesAdapter.getInitialState()

export const articlesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Get all articles
        getArticles: builder.query({
            query: () => ({
                url: '/articles', // Base Query is already provided inside apiSlice
                validateStatus: (response, result) => { // Check response status
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: responseData => { // Due to usage of _id instead of id property in MongoDB responses
                const loadedArticles = responseData.map(article => {
                    article.id = article._id // Map _id to id property
                    return article
                })

                return articlesAdapter.setAll(initialState, loadedArticles)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) { // Check for id property
                    return [
                        { type: 'Article', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Article', id }))
                    ]
                } else return [{ type: 'Article', id: 'LIST' }] // Fail Safe
            }
        }),
        // Create New Article
        addNewArticle: builder.mutation({
            query: initialArticleData => ({
                url: '/articles',
                method: 'POST',
                body: {
                    ...initialArticleData
                }
            }),
            invalidatesTags: [
                { type: 'Article', id: 'LIST' }
            ]
        }),
        // Update Article
        updateArticle: builder.mutation({
            query: initialArticleData => ({
                url: '/articles',
                method: 'PATCH',
                body: {
                    ...initialArticleData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Article', id: arg.id }
            ]
        }),
        // Delete Article
        deleteArticle: builder.mutation({
            query: ({ id }) => ({
                url: '/articles',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Article', id: arg.id }
            ]
        }),

        // Public
        signupArticle: builder.mutation({
            query: initialArticleData => ({
                url: '/public/signup',
                method: 'POST',
                body: {
                    ...initialArticleData
                }
            }),
            invalidatesTags: [
                { type: 'Article', id: 'LIST' }
            ]
        })
    })
})

export const {
    // Create hooks (add use in the beginning and Query/Mutation at the end)
    useGetArticlesQuery,
    useAddNewArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation
} = articlesApiSlice

// Selectors
export const selectArticlesResult = articlesApiSlice.endpoints.getArticles.select() // Returns Query Result object

const selectArticlesData = createSelector( // Create Memorised selector
    selectArticlesResult,
    articlesResult => articlesResult.data // Normalised State object with IDs & Entities
)

export const { // getSelectors creates these selectors
    // Rename selectors with aliases using destructuring
    selectAll: selectAllArticles,
    selectById: selectArticleById,
    selectIds: selectArticleIds
    // Pass in a selector that returns the articles slice of state
} = articlesAdapter.getSelectors(state => selectArticlesData(state) ?? initialState)