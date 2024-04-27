import { useGetPostsQuery } from './postsApiSlice'

import Post from './Post'

// TODO: add sorting based on date created
const PostsList = () => {
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

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        // TODO: add entities
        const { ids } = posts

        const tableContent = ids?.length
            ? ids.map(postId => <Post key={postId} postId={postId} />)
            : null

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