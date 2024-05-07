import { useLocation, Navigate, Outlet } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'

// Use this on any route in the App
const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        // Check roles
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to='/login' state={{ form: location }} replace />
    )

    return content
}

export default RequireAuth