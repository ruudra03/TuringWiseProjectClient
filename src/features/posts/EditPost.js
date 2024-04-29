import { useParams } from 'react-router-dom'
import PulseLoader from 'react-spinners/PulseLoader'

import EditPostForm from './EditPostForm'
import { useGetPostsQuery } from '../posts/postsApiSlice'
import useAuth from '../../hooks/useAuth'

const EditPost = () => {
    const { id } = useParams()

    const { username, isOrgAdmin, isAdmin } = useAuth()

    const { post } = useGetPostsQuery('postsList', {
        selectFromResult: ({ data }) => ({
            post: data?.entities[id]
        })
    })

    if (!post) return <PulseLoader color={'#FFF'} />

    if (!isOrgAdmin && !isAdmin) {
        if (post.username !== username) {
            return <p className='errMsg'>No access</p>
        }
    }

    const content = <EditPostForm post={post} />

    return content
}

export default EditPost