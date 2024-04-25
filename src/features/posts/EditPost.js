import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectPostById } from '../posts/postsApiSlice'
import EditPostForm from './EditPostForm'

const EditPost = () => {
    const { id } = useParams()

    const post = useSelector(state => selectPostById(state, id))

    const content = post ? <EditPostForm post={post} /> : <p>Loading...</p>

    return content
}

export default EditPost