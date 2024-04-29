import { useGetPostsQuery } from './postsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

import Post from './Post'
import useAuth from '../../hooks/useAuth'

// TODO: add sorting based on date created
// TODO: the username for all the post being saved is always set to admin which is an error
const PostsList = () => {
    const { username, isOrgAdmin, isAdmin } = useAuth()

    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('postsList', {
        pollingInterval: 15000, // Equals to 15secs
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={'#FFF'} />

    if (isError) {
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        // TODO: add entities
        const { ids, entities } = posts

        // TODO: logic change required here
        let filteredIds
        if (isOrgAdmin || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(postId => entities[postId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(postId => <Post key={postId} postId={postId} />)

        content = (
            <table className='table table--posts'>
                <thead className='table__thead'>
                    <tr>
                        <th scope='col' className='table__th post__title'>
                            Title
                        </th>
                        <th scope='col' className='table__th post__body'>
                            Body
                        </th>
                        <th scope='col' className='table__th post__tags'>
                            Tags
                        </th>
                        <th scope='col' className='table__th post__username'>
                            Username
                        </th>
                        <th scope='col' className='table__th post__edited'>
                            Edited
                        </th>
                        <th scope='col' className='table__th post__created'>
                            Created
                        </th>
                        <th scope='col' className='table__th post__updated'>
                            Updated
                        </th>
                        <th scope='col' className='table__th post__edit'>
                            Edit
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

export default PostsList