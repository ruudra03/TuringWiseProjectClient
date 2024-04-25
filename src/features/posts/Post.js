import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectPostById } from './postsApiSlice'

const Post = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))

    const navigate = useNavigate()

    if (post) {
        const handleEdit = () => navigate(`/dash/posts/${postId}`)

        const created = new Date(post.createdAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })
        const updated = new Date(post.updatedAt).toLocaleString('en-UK', { day: 'numeric', month: 'long' })

        const postTagsString = post.tags.toString().replaceAll(',', ', ')

        const postIsEdited = post.edited ? 'Yes' : 'n/a'

        return (
            <tr className='table__row post'>
                <td className={'table__cell post__title'}>{post.title}</td>
                <td className={'table__cell post__body'}>{post.body}</td>
                <td className={'table__cell post__tags'}>{postTagsString}</td>
                <td className={'table__cell post__username'}>{post.username}</td>
                <td className={'table__cell post__edited'}>{postIsEdited}</td>
                <td className={'table__cell post__created'}>{created}</td>
                <td className={'table__cell post__updated'}>{updated}</td>
                <td className={'table__cell'}>
                    <button
                        className='icon-button table__button'
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null
}

export default Post