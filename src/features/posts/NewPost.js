import { useSelector } from 'react-redux'

import { selectAllUsers } from '../users/usersApiSlice'
import NewPostForm from '../posts/NewPostForm'

const NewPost = () => {
    const users = useSelector(selectAllUsers)

    if (!users?.length) return <p>Feature currently unavailable</p>

    const content = <NewPostForm users={users} />

    return content
}

export default NewPost