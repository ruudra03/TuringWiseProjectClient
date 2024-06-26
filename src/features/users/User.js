import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { memo } from 'react'

import { useGetUsersQuery } from './usersApiSlice'

const User = ({ userId }) => {
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        const userRolesString = user.roles.toString().replaceAll(',', ', ')

        const userStatus = user.active ? 'Active' : 'Inactive'
        const userCellStatus = user.active ? '' : 'table__cell--inactive'

        return (
            <tr className='table__row user'>
                <td className={`table__cell ${userCellStatus}`}>{user.name}</td>
                <td className={`table__cell ${userCellStatus}`}>{user.username}</td>
                <td className={`table__cell ${userCellStatus}`}>{user.email}</td>
                <td className={`table__cell ${userCellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${userCellStatus}`}>{userStatus}</td>
                <td className={`table__cell ${userCellStatus}`}>
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

const memoisedUser = memo(User)

export default memoisedUser