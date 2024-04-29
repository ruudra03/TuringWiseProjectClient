import PulseLoader from 'react-spinners/PulseLoader'

import { useGetUsersQuery } from '../users/usersApiSlice'
import NewPostForm from '../posts/NewPostForm'

const NewPost = () => {
    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length) return <PulseLoader color={'#FFF'} />

    const content = <NewPostForm users={users} />

    return content
}

export default NewPost