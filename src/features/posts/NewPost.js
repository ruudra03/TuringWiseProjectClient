import { useSelector } from 'react-redux'

import { selectAllUsers } from '../users/usersApiSlice'
import NewPostForm from '../posts/NewPostForm'

const NewPost = () => {
    const users = useSelector(selectAllUsers)

    const content = users ? <NewPostForm users={users} /> : <p>Loading...</p>

    return content
}

export default NewPost