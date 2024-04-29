import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

import User from './User'

const UsersList = () => {
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000, // Equals to 60secs
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={'#FFF'} />

    if (isError) {
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = users // data was renamed users above when destructuring useGetUsersQuery result

        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />)

        content = (
            <table className='table table--users'>
                <thead className='table__thead'>
                    <tr>
                        <th scope='col' className='table__th user__name'>
                            Name
                        </th>
                        <th scope='col' className='table__th user__username'>
                            Username
                        </th>
                        <th scope='col' className='table__th user__email'>
                            Email
                        </th>
                        <th scope='col' className='table__th user__roles'>
                            Roles
                        </th>
                        <th scope='col' className='table__th user__status'>
                            Status
                        </th>
                        <th scope='col' className='table__th user__edit'>
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

export default UsersList