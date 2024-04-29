import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { postsApiSlice } from '../posts/postsApiSlice'

const Prefetch = () => {
    useEffect(() => {
        store.dispatch(postsApiSlice.util.prefetch('getPosts', 'postsList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, [])

    return <Outlet />
}

export default Prefetch