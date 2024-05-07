import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'

// Get the token 
import { selectCurrentToken } from '../app/api/authSlice'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)

    let isOrgUser = false
    let isOrgAdmin = false
    let isAdmin = false
    let status = 'User'

    // Token found
    if (token) {
        // Decode JWT-Token
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        // Assign Roles (User already has default value "User")
        isOrgUser = roles.includes('Organisation User')
        isOrgAdmin = roles.includes('Organisation Admin')
        isAdmin = roles.includes('Admin')

        // Set roles values in "status"
        if (isOrgUser) status = 'Organisation User'
        if (isOrgAdmin) status = 'Organisation Admin'
        if (isAdmin) status = 'Admin'

        return { username, roles, isOrgUser, isOrgAdmin, isAdmin, status }
    }

    return { username: '', roles: [], isOrgUser, isOrgAdmin, isAdmin, status }
}

export default useAuth