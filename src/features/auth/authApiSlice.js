import { apiSlice } from '../../app/api/apiSlice'
import { removeCredentials, setCredentials } from '../../app/api/authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // NOTE: using onQueryStarted() to avoid using useDispatch() inside every component when calling this mutation
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    // clear Credentials
                    const { data } = await queryFulfilled
                    console.log(data) // returns "Cookies Cleared"

                    dispatch(removeCredentials())
                    // NOTE: using setTimeout() here to wait for the isSuccess state of sendLogout to change before reseting the whole api state
                    setTimeout(() => {
                        console.log('API state cleared')
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000) // equals to 1sec
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice