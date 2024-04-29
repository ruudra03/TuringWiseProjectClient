import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)

    let isOrgUser = false
    let isOrgAdmin = false
    let isAdmin = false
    let status = 'User'

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isOrgUser = roles.includes('Organisation User')
        isOrgAdmin = roles.includes('Organisation Admin')
        isAdmin = roles.includes('Admin')

        if (isOrgUser) status = 'Organisation User'
        if (isOrgAdmin) status = 'Organisation Admin'
        if (isAdmin) status = 'Admin'

        return { username, roles, isOrgUser, isOrgAdmin, isAdmin, status }
    }

    return { username: '', roles: [], isOrgUser, isOrgAdmin, isAdmin, status }
}

export default useAuth