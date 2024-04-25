import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { postsApiSlice } from '../posts/postsApiSlice'

const Prefetch = () => {
    useEffect(() => {
        console.log('Suscribing')

        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        const posts = store.dispatch(postsApiSlice.endpoints.getPosts.initiate())

        return () => {
            console.log('Unsuscribing')
            users.unsubscribe()
            posts.unsubscribe()
        }
    }, [])


    return <Outlet />
}

export default Prefetch